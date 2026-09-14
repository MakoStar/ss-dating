import type { Row } from './types';

/** 根据行数据生成头像名称 */
export const avatarName = (r: Row): string => {
  if (r.enCharName) return r.enCharName.replace(/\s+/g, '_');
  if (r.charName) return r.charName.replace(/\s+/g, '_');
  return String(r.charId);
};

/** 根据星级生成星数 */
export const starText = (grade?: number): string => {
  if (grade == null || Number.isNaN(grade)) return '';
  const n = Math.max(0, Math.min(6, Math.round(grade)));
  return '★'.repeat(n);
};
