export const AREA_LABELS = {
  CN: '简体中文',
  EN: 'English',
  JP: '日本語',
  KR: '한국어',
  TW: '繁體中文',
} as const;

export type AreaKey = keyof typeof AREA_LABELS;

/** 头像资源 api 地址: 感谢 torikushiii StellaSoraAPI */
export const ASSET_BASE = 'https://api.ennead.cc/stella/assets';

export const AREA_TO_LANG: Record<string, string> = {
  CN: 'zh-CN',
  EN: 'en',
  JP: 'ja',
  KR: 'ko',
  TW: 'zh-TW',
};

export const STORAGE = {
  theme: 'de-theme',
  area: 'de-area',
} as const;
