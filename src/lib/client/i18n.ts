import { t } from '../i18n';
import { AREA_TO_LANG } from '../constants';

/** 项目语言 key { Intl locale, 时区 } */
export const LOCALE_MAP = {
  CN: { locale: 'zh-CN', timeZone: 'Asia/Shanghai' },
  TW: { locale: 'zh-TW', timeZone: 'Asia/Taipei' },
  JP: { locale: 'ja-JP', timeZone: 'Asia/Tokyo' },
  KR: { locale: 'ko-KR', timeZone: 'Asia/Seoul' },
  EN: { locale: 'en-US', timeZone: 'America/New_York' },
} as const satisfies Record<string, { locale: string; timeZone: string }>;

export type LangKey = keyof typeof LOCALE_MAP;

/** 按语言格式化构建时间 */
export function formatBuildDate(lang: string, iso: string): string {
  const key = (lang in LOCALE_MAP ? lang : 'EN') as LangKey;
  const { locale, timeZone } = LOCALE_MAP[key];
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

/** 按不同区域渲染不同时区的时间 */
export function renderBuildTime(lang: string) {
  document.querySelectorAll<HTMLTimeElement>('[data-build-time]').forEach((el) => {
    if (el.dateTime) el.textContent = formatBuildDate(lang, el.dateTime);
  });
}

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

  renderBuildTime(lang);

  document.title = t(lang, 'title');
}
