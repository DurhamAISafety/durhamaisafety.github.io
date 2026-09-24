import { readYaml } from './content';
import { renderInlineMarkdown } from './programmes';

export interface Announcement {
  enabled: boolean;
  message: string;
  link_url?: string;
  link_label?: string;
  expires?: string;
}

/** The announcement to render, or null when it is disabled, empty or expired. */
export function getActiveAnnouncement(): (Announcement & { messageHtml: string; external: boolean }) | null {
  const a = readYaml<Announcement>('announcement.yml');
  if (!a?.enabled || !a.message) return null;

  // ponytail: expiry is evaluated at BUILD time (UTC date), not in the visitor's browser. The site
  // only rebuilds on push to main, so an expired banner stays live until the next deploy. Add a
  // scheduled workflow run (cron) if that ever matters.
  const expires = String(a.expires ?? '').slice(0, 10);
  if (expires && expires < new Date().toISOString().slice(0, 10)) return null;

  return {
    ...a,
    messageHtml: renderInlineMarkdown(a.message),
    external: /^https?:\/\//.test(a.link_url ?? ''),
  };
}
