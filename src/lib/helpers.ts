import type { Row } from './types';

/** 根据行数据生成头像名称 */
export const avatarName = (r: Row): string => {
  // if (r.enCharName) return r.enCharName.replace(/\s+/g, '_');
  // if (r.charName) return r.charName.replace(/\s+/g, '_');
  return `head_${r.charId}01_S`;
};

/** 根据星级生成星数 */
export const starText = (grade?: number): string => {
  if (grade == null || Number.isNaN(grade)) return '';
  const n = Math.max(0, Math.min(6, Math.round(grade)));
  return '★'.repeat(n);
};

/** 处理资源图片路径 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL;
  return `${base}assets/${path.replace(/^\/+/, '')}`;
}

/** XML 文本转义 */
export const escapeXml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c] ?? c)
  );

/** 无 Image 时的内联 SVG 兜底图 */
export function makeNoImageSvg(text = 'No Image', w = 200, h = 150): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <rect width="100%" height="100%" fill="#eeeeee"/>
      <text x="50%" y="50%" fill="#999999" 
        font-size="16" text-anchor="middle" 
        dominant-baseline="middle"
      >${escapeXml(text)}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const NO_IMAGE_SVG = makeNoImageSvg();

/** 生成 <img> 的 onerror 内联脚本字符串 */
export function onImgError(fallback: string = NO_IMAGE_SVG, alt = 'No Image'): string {
  const url = fallback === NO_IMAGE_SVG
    ? NO_IMAGE_SVG.replace('No Image', alt)
    : fallback;
  const escapedUrl = url.replace(/'/g, "\\'");
  return `this.onerror=null; this.src='${escapedUrl}';`;
}
