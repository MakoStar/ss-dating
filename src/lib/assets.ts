import type { ImageMetadata } from 'astro';
import type { Row } from './types';

/** 从 glob 结果构建文件名 -> ImageMetadata 的映射 */
function buildMap(
  modules: Record<string, { default: ImageMetadata }>,
  ext: string,
): Record<string, ImageMetadata> {
  const map: Record<string, ImageMetadata> = {};
  const re = new RegExp(`\\.${ext}$`);
  for (const [path, mod] of Object.entries(modules)) {
    const name = path.split('/').pop()!.replace(re, '');
    map[name] = mod.default;
  }
  return map;
}

const cgModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/datingeventcg/*.webp',
  { eager: true },
);

const headModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/head/*.webp',
  { eager: true },
);

/** 事件 CG：key 是文件名（如 `DatingSPCG_145301`） */
export const cgMap = buildMap(cgModules, 'webp');

/** 头像：key 是文件名（如 `head_10801_S`） */
export const headMap = buildMap(headModules, 'webp');

/** 按文件名取事件 CG，找不到返回 undefined */
export function getCg(name?: string | null): ImageMetadata | undefined {
  return name ? cgMap[name] : undefined;
}

/** 按文件名取头像，找不到返回 undefined */
export function getHead(name?: string | null): ImageMetadata | undefined {
  return name ? headMap[name] : undefined;
}

export function getHeadByRow(r: Row): ImageMetadata | undefined {
  const name = `head_${r.charId}01_S`;
  return headMap[name];
}

export function getCgByRow(r: Row): ImageMetadata | undefined {
  return r.eventCg ? cgMap[r.eventCg] : undefined;
}
