/** 获取元素 */
export function $<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el;
}

/** 读取区域计数 */
export function readAreaCounts(): Record<string, number> {
  try {
    const el = document.getElementById('area-counts');
    return el?.textContent
      ? (JSON.parse(el.textContent) as Record<string, number>)
      : {};
  } catch {
    return {};
  }
}
