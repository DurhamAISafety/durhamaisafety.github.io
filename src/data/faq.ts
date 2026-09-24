import { readYaml } from './content';
import { renderMarkdown } from './programmes';

export interface FaqItem {
  question: string;
  answer: string;
}

/** Strips the inline markdown renderMarkdown understands, for plain-text uses such as JSON-LD. */
function toPlainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/(\*\*|\*|_)(.+?)\1/g, '$2')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getFaqContent(): { faqs: (FaqItem & { answerHtml: string; answerText: string })[] } {
  const { faqs = [] } = readYaml<{ faqs?: FaqItem[] }>('faq.yml') ?? {};
  return {
    faqs: faqs.map((f) => ({ ...f, answerHtml: renderMarkdown(f.answer), answerText: toPlainText(f.answer) })),
  };
}
