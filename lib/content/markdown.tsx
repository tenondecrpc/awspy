// Tiny markdown-to-React renderer used by `CodeOfConductTemplate`.
//
// Supports the subset of markdown used in our content files:
//   - ATX headings: `## H2`, `### H3` (H1 is reserved for the page title)
//   - Paragraphs separated by blank lines
//   - Unordered lists: lines starting with `- `
//   - Inline links: `[text](url)`
//   - Inline emphasis: `**bold**` and `*italic*`
//   - Inline code: `` `code` ``
//
// Anything fancier (tables, fenced code blocks with syntax highlighting,
// images, blockquotes) is currently out of scope. If our content needs them
// later, replace this module with @next/mdx's component-import flow.

import type { ReactNode } from "react";
import { isSafeMarkdownHref } from "@/lib/validation/urls";

type InlineToken =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "bold"; children: InlineToken[] }
  | { type: "italic"; children: InlineToken[] }
  | { type: "link"; href: string; children: InlineToken[] };

function renderInlineTokens(
  tokens: InlineToken[],
  keyPrefix: string
): ReactNode[] {
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (token.type) {
      case "text":
        return <span key={key}>{token.value}</span>;
      case "code":
        return (
          <code
            key={key}
            className="rounded bg-[var(--color-surface-muted)] px-1 py-0.5 text-sm"
          >
            {token.value}
          </code>
        );
      case "bold":
        return (
          <strong key={key}>{renderInlineTokens(token.children, key)}</strong>
        );
      case "italic":
        return <em key={key}>{renderInlineTokens(token.children, key)}</em>;
      case "link":
        return (
          <a
            key={key}
            href={token.href}
            className="text-[var(--color-accent)] underline-offset-2 hover:underline"
            {...(/^https?:\/\//i.test(token.href)
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {renderInlineTokens(token.children, key)}
          </a>
        );
    }
  });
}

function tokenizeInline(text: string): InlineToken[] {
  // Match the highest-priority token from the start of `text` repeatedly.
  // The grammar is intentionally tiny: ordering matters because nested
  // emphasis is not supported.
  const tokens: InlineToken[] = [];
  let i = 0;
  let buffer = "";

  function flushText() {
    if (buffer.length > 0) {
      tokens.push({ type: "text", value: buffer });
      buffer = "";
    }
  }

  while (i < text.length) {
    const rest = text.slice(i);

    // Inline code first so backticks inside emphasis are not confused.
    const codeMatch = /^`([^`]+)`/.exec(rest);
    if (codeMatch) {
      flushText();
      tokens.push({ type: "code", value: codeMatch[1] });
      i += codeMatch[0].length;
      continue;
    }

    const boldMatch = /^\*\*([^*]+)\*\*/.exec(rest);
    if (boldMatch) {
      flushText();
      tokens.push({ type: "bold", children: tokenizeInline(boldMatch[1]) });
      i += boldMatch[0].length;
      continue;
    }

    const italicMatch = /^\*([^*]+)\*/.exec(rest);
    if (italicMatch) {
      flushText();
      tokens.push({ type: "italic", children: tokenizeInline(italicMatch[1]) });
      i += italicMatch[0].length;
      continue;
    }

    const linkMatch = /^\[([^\]]+)\]\(([^)\s]+)\)/.exec(rest);
    if (linkMatch) {
      flushText();
      tokens.push(
        isSafeMarkdownHref(linkMatch[2])
          ? {
              type: "link",
              href: linkMatch[2],
              children: tokenizeInline(linkMatch[1]),
            }
          : { type: "text", value: linkMatch[1] }
      );
      i += linkMatch[0].length;
      continue;
    }

    buffer += text[i];
    i += 1;
  }
  flushText();
  return tokens;
}

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) {
      i += 1;
      continue;
    }
    const h1 = /^# (.*)$/.exec(line);
    if (h1) {
      blocks.push({ type: "h1", text: h1[1].trim() });
      i += 1;
      continue;
    }
    const h2 = /^## (.*)$/.exec(line);
    if (h2) {
      blocks.push({ type: "h2", text: h2[1].trim() });
      i += 1;
      continue;
    }
    const h3 = /^### (.*)$/.exec(line);
    if (h3) {
      blocks.push({ type: "h3", text: h3[1].trim() });
      i += 1;
      continue;
    }
    if (/^- /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^- /.test(lines[i])) {
        items.push(lines[i].replace(/^- /, "").trim());
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    // Otherwise: collect lines until blank into a paragraph.
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^#{1,3} /.test(lines[i]) &&
      !/^- /.test(lines[i])
    ) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }
    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
    }
  }
  return blocks;
}

type RenderMarkdownProps = {
  source: string;
  /** When true, the first H1 in the source is dropped because the page
   *  template renders its own H1. Defaults to true. */
  hideFirstH1?: boolean;
};

export function RenderMarkdown({
  source,
  hideFirstH1 = true,
}: RenderMarkdownProps) {
  let blocks = parseBlocks(source);
  if (hideFirstH1) {
    const firstH1 = blocks.findIndex((b) => b.type === "h1");
    if (firstH1 >= 0) {
      blocks = [...blocks.slice(0, firstH1), ...blocks.slice(firstH1 + 1)];
    }
  }
  return (
    <div className="prose-content space-y-4 text-[var(--color-text-primary)]">
      {blocks.map((block, index) => {
        const key = `block-${index}`;
        switch (block.type) {
          case "h1":
            return (
              <h2 key={key} className="text-3xl font-bold tracking-tight">
                {renderInlineTokens(tokenizeInline(block.text), key)}
              </h2>
            );
          case "h2":
            return (
              <h2 key={key} className="text-2xl font-bold tracking-tight">
                {renderInlineTokens(tokenizeInline(block.text), key)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={key} className="text-xl font-semibold">
                {renderInlineTokens(tokenizeInline(block.text), key)}
              </h3>
            );
          case "paragraph":
            return (
              <p key={key}>
                {renderInlineTokens(tokenizeInline(block.text), key)}
              </p>
            );
          case "ul":
            return (
              <ul key={key} className="list-disc space-y-1 pl-6">
                {block.items.map((item, i) => (
                  <li key={`${key}-${i}`}>
                    {renderInlineTokens(tokenizeInline(item), `${key}-${i}`)}
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
