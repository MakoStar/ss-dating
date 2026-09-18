import type { SelectEntry } from '../types';

/** 填充下拉选择框 */
export function fillSelect(
  select: HTMLSelectElement,
  entries: Map<string, SelectEntry>,
  placeholder: string,
  formatLabel?: (value: string, entry: SelectEntry) => string,
): void {
  const current = select.value;
  select.innerHTML = '';

  const first = document.createElement('option');
  first.value = '';
  first.textContent = placeholder;
  select.appendChild(first);

  /** 填充选项 */
  for (const [value, entry] of entries) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = formatLabel
      ? formatLabel(value, entry)
      : entry.count > 1
        ? `${entry.label} (${entry.count})`
        : entry.label;
    select.appendChild(opt);
  }

  select.value = current === '' || entries.has(current) ? current : '';
}

/** 判断卡片是否匹配查询 */
export function matchesQuery(c: HTMLElement, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  return tokens.every((tok) => {
    if (/^\d+$/.test(tok)) {
      return c.dataset.charId === tok || c.dataset.eventId === tok;
    }
    return (c.dataset.search ?? '').includes(tok);
  });
}

/** 按 ID 降序排序 */
export function byIdDesc(a: [string, SelectEntry], b: [string, SelectEntry]): number {
  // return Number(b[0]) - Number(a[0]);
  return Number(a[0]) - Number(b[0]);
}
