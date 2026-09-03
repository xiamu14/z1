type BlockNoteStyles = {
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  strike?: boolean;
  underline?: boolean;
};

type BlockNoteInlineContent =
  | {
      styles?: BlockNoteStyles;
      text?: string;
      type: 'text';
    }
  | {
      content?: BlockNoteInlineContent[];
      href?: string;
      type: 'link';
    };

type BlockNoteBlock = {
  content?: BlockNoteInlineContent[];
  props?: {
    language?: string;
    level?: number;
  };
  type?: string;
};

function escapeHTML(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderInline(nodes: BlockNoteInlineContent[] = []): string {
  return nodes
    .map((node) => {
      if (node.type === 'link') {
        const href = node.href ? escapeHTML(node.href) : '#';
        const content = renderInline(node.content);

        return `<a href="${href}" target="_blank" rel="noreferrer">${content}</a>`;
      }

      let text = escapeHTML(node.text ?? '');
      const styles = node.styles ?? {};

      if (styles.code) {
        text = `<code>${text}</code>`;
      }

      if (styles.bold) {
        text = `<strong>${text}</strong>`;
      }

      if (styles.italic) {
        text = `<em>${text}</em>`;
      }

      if (styles.underline) {
        text = `<u>${text}</u>`;
      }

      if (styles.strike) {
        text = `<s>${text}</s>`;
      }

      return text;
    })
    .join('');
}

function renderBlock(block: BlockNoteBlock): string {
  const content = renderInline(block.content);

  switch (block.type) {
    case 'heading': {
      const level = Math.min(Math.max(block.props?.level ?? 2, 1), 6);
      return `<h${level}>${content}</h${level}>`;
    }
    case 'codeBlock': {
      const language = block.props?.language
        ? ` data-language="${escapeHTML(block.props.language)}"`
        : '';
      return `<pre><code${language}>${content}</code></pre>`;
    }
    case 'paragraph':
    default:
      return `<p>${content}</p>`;
  }
}

export async function renderBlockNote(
  document: unknown[] | null | undefined,
): Promise<string> {
  if (!Array.isArray(document) || document.length === 0) {
    return '';
  }

  const blocks = document as BlockNoteBlock[];
  const html: string[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];

    if (block.type === 'bulletListItem' || block.type === 'numberedListItem') {
      const listTag = block.type === 'numberedListItem' ? 'ol' : 'ul';
      const items: string[] = [];

      while (index < blocks.length && blocks[index]?.type === block.type) {
        items.push(`<li>${renderInline(blocks[index]?.content)}</li>`);
        index += 1;
      }

      html.push(`<${listTag}>${items.join('')}</${listTag}>`);
      continue;
    }

    html.push(renderBlock(block));
    index += 1;
  }

  return html.join('\n');
}
