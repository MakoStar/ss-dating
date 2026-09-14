import { t } from '../i18n';
import { AREA_TO_LANG } from '../constants';

/** 应用 UI 语言 */
export function applyUiLang(lang: string, areaCount: number): void {
  document.documentElement.lang = AREA_TO_LANG[lang] ?? 'en';

  /** 更新所有带有 data-i18n 属性的元素的文本内容 */
  for (const el of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
    const key = el.dataset.i18n;
    if (!key) continue;
    const cnt =
      key === 'subtitle'
        ? areaCount
        : el.dataset.i18nCount
          ? Number(el.dataset.i18nCount)
          : undefined;
    el.textContent = t(lang, key, cnt);
  }

  /** 更新所有带有 data-i18n-placeholder 属性的输入框的 placeholder */
  for (const el of document.querySelectorAll<HTMLInputElement>(
    '[data-i18n-placeholder]',
  )) {
    const key = el.dataset.i18nPlaceholder;
    if (!key) continue;
    el.placeholder = t(lang, key);
  }

  document.title = t(lang, 'title');
}
