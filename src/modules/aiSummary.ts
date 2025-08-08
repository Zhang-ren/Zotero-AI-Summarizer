import { getPref } from "../utils/prefs";
import { marked } from "marked";

function ensureHtml(text: string): string {
  if (!text) return "<p>(无内容)</p>";
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\n/g, "<br>");
}

function markdownToHTML(md: string): string {
  if (!md) return "<p>(无内容)</p>";
  // 直接使用 marked 渲染；由 marked 负责表格、列表、标题、代码等完整语法
  return marked.parse(md) as string;
}

async function collectItemContext(item: Zotero.Item): Promise<{
  title: string;
  abstractNote: string;
  content: string;
}> {
  const title = item.getDisplayTitle();
  const abstractNote = (item.getField("abstractNote") as string) || "";

  const texts: string[] = [];
  try {
    if (item.isRegularItem()) {
      const attachmentIDs = item.getAttachments();
      for (const id of attachmentIDs) {
        const att = Zotero.Items.get(id) as Zotero.Item;
        const ct = (att as any).attachmentContentType as string | undefined;
        if (!ct) continue;
        if (
          (ct && ct.indexOf("application/pdf") >= 0) ||
          (ct && ct.indexOf("text/html") >= 0)
        ) {
          try {
            const txt = await (att as any).attachmentText;
            if (txt) texts.push(txt as string);
          } catch (_e) {
            // 忽略单个附件提取失败
          }
        }
      }
    }
  } catch (_e) {
    // 忽略全文提取失败
  }

  const maxChars = Number(getPref("maxChars" as any) ?? 8000);
  const joined = texts.join("\n\n");
  const content = joined.length > maxChars ? joined.slice(0, maxChars) : joined;
  return { title, abstractNote, content };
}

async function callChatCompletion(prompt: string): Promise<string> {
  const base =
    (getPref("apiBase" as any) as string) || "https://api.openai.com/v1";
  const apiKey = (getPref("apiKey" as any) as string) || "";
  const model = (getPref("model" as any) as string) || "gpt-4o-mini";
  const temperature = Number(getPref("temperature" as any) ?? 0.2);

  if (!apiKey) {
    throw new Error("未配置 API Key，请在偏好设置中填写。");
  }

  const url = `${base.replace(/\/$/, "")}/chat/completions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "你是学术助手，请用中文输出，结构清晰，重点明确。",
        },
        { role: "user", content: prompt },
      ],
      temperature,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`调用模型失败: ${res.status} ${res.statusText} - ${text}`);
  }
  const data: any = await res.json();
  const content =
    data &&
    data.choices &&
    data.choices[0] &&
    data.choices[0].message &&
    data.choices[0].message.content;
  return String(content || "").trim();
}

function replaceAll(str: string, search: string, replacement: string): string {
  return str.split(search).join(replacement);
}

function buildPrompt(
  tpl: string,
  data: { title: string; abstractNote: string; content: string },
): string {
  let out = tpl;
  out = replaceAll(out, "{title}", data.title || "");
  out = replaceAll(out, "{abstract}", data.abstractNote || "");
  out = replaceAll(out, "{content}", data.content || "");
  return out;
}

async function summarizeItemToChildNote(item: Zotero.Item): Promise<void> {
  const ctx = await collectItemContext(item);
  const defaultTpl =
    "请阅读以下论文信息与内容片段，并输出结构化中文摘要：\n" +
    "- 题目：{title}\n" +
    "- 摘要：{abstract}\n" +
    "- 正文片段（可能被截断）：\n{content}\n\n" +
    "请用要点列出：研究问题、方法、数据/实验、主要结论、贡献与局限、可复现要点、与我研究的相关性（若未知可留空）。";
  const tpl = (getPref("prompt" as any) as string) || defaultTpl;
  const userPrompt = buildPrompt(tpl, ctx);

  const progress = new ztoolkit.ProgressWindow(addon.data.config.addonName)
    .createLine({ text: `总结中：${ctx.title}`, progress: 10 })
    .show();

  let summary = "";
  try {
    summary = await callChatCompletion(userPrompt);
  } finally {
    progress.changeLine({ text: `写入笔记：${ctx.title}`, progress: 80 });
  }

  const model = (getPref("model" as any) as string) || "gpt-4o-mini";
  const note = new Zotero.Item("note");
  note.parentID = item.id;
  const header = `<p><b>AI 摘要（${model}）</b></p><hr>`;
  // 将 Markdown 渲染为 Zotero 笔记可识别的 HTML
  const rendered = markdownToHTML(summary);
  note.setNote(header + rendered);
  await note.saveTx();

  progress.changeLine({ text: `完成：${ctx.title}`, progress: 100 });
  progress.startCloseTimer(2000);
}

export async function testAPIConnectivity(): Promise<string> {
  try {
    const res = await callChatCompletion("请直接回复：pong");
    return `连接成功：${res}`;
  } catch (e: any) {
    return `连接失败：${e?.message || e}`;
  }
}

export class AISummaryModule {
  static registerContextMenu() {
    const label = "AI 总结到子笔记";
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: `zotero-itemmenu-${addon.data.config.addonRef}-ai-summarize`,
      label,
      commandListener: async () => {
        try {
          await AISummaryModule.summarizeSelected();
        } catch (e: any) {
          ztoolkit.getGlobal("alert")(`AI 总结失败：${e?.message || e}`);
        }
      },
    });
  }

  static async summarizeSelected() {
    const pane = ztoolkit.getGlobal("ZoteroPane");
    const items = (pane.getSelectedItems() as Zotero.Item[]).filter((it) =>
      it.isRegularItem(),
    );
    if (!items.length) {
      ztoolkit.getGlobal("alert")(
        "请先在中间列表选择至少一个条目（非笔记/非附件）。",
      );
      return;
    }

    for (const item of items) {
      try {
        await summarizeItemToChildNote(item);
      } catch (e: any) {
        new ztoolkit.ProgressWindow(addon.data.config.addonName)
          .createLine({
            text: `条目失败：${item.getDisplayTitle()} - ${e?.message || e}`,
            type: "error",
          })
          .show();
      }
    }
  }

  static async testAPI() {
    const result = await testAPIConnectivity();
    ztoolkit.getGlobal("alert")(result);
  }
}
