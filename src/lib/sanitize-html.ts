const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeAttribute = (value: string): string =>
  escapeHtml(value).replace(/"/g, '&quot;');

const isAllowedHref = (href: string): boolean =>
  href.startsWith('/') ||
  href.startsWith('#') ||
  href.startsWith('mailto:') ||
  href.startsWith('https://') ||
  href.startsWith('http://');

const getAttribute = (tag: string, name: string): string | null => {
  const pattern = new RegExp(`${name}\\s*=\\s*(["'])(.*?)\\1`, 'i');
  return pattern.exec(tag)?.[2] ?? null;
};

const sanitiseAnchor = (tag: string): string => {
  const href = getAttribute(tag, 'href');
  if (!href || !isAllowedHref(href)) return '';

  const className = getAttribute(tag, 'class');
  const classAttribute =
    className && /^[\w\s:/.[\]#%()-]+$/.test(className)
      ? ` class="${escapeAttribute(className)}"`
      : '';
  const isExternal = href.startsWith('http://') || href.startsWith('https://');
  const targetAttribute = isExternal ? ' target="_blank"' : '';
  const relAttribute = isExternal ? ' rel="noopener noreferrer"' : '';

  return `<a href="${escapeAttribute(href)}"${classAttribute}${targetAttribute}${relAttribute}>`;
};

export function sanitiseInlineHtml(input: string | null | undefined): string {
  if (!input) return '';
  let anchorOpen = false;

  return input
    .split(/(<[^>]*>)/g)
    .map((part) => {
      if (!part.startsWith('<')) return escapeHtml(part);

      const tag = part.trim();
      const lower = tag.toLowerCase();
      if (/^<\/?(em|strong|b|i)>$/.test(lower)) return lower;
      if (/^<br\s*\/?>$/.test(lower)) return '<br>';
      if (lower === '</a>') {
        if (!anchorOpen) return '';
        anchorOpen = false;
        return '</a>';
      }
      if (/^<a\s/i.test(tag)) {
        const anchor = sanitiseAnchor(tag);
        anchorOpen = !!anchor;
        return anchor;
      }

      return escapeHtml(part);
    })
    .join('');
}
