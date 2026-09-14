import fs from 'node:fs';
import { CHANGELOG_PATH } from './paths';

/** 变更事件数据集 */
export interface ChangelogSets {
  added: Set<number>;
  modified: Set<number>;
}

/** 把任意输入转成合法的 number Set，非数组或含非法值一律过滤掉 */
function toNumberSet(value: unknown): Set<number> {
  if (!Array.isArray(value)) return new Set<number>();
  const nums = value.filter(
    (x): x is number => typeof x === 'number' && Number.isFinite(x),
  );
  return new Set<number>(nums);
}

/** 加载变更事件数据 */
export function loadChangelog(): ChangelogSets {
  const empty: ChangelogSets = {
    added: new Set<number>(),
    modified: new Set<number>(),
  };

  if (!fs.existsSync(CHANGELOG_PATH)) return empty;

  try {
    /** 读取变更事件数据 */
    const raw = JSON.parse(fs.readFileSync(CHANGELOG_PATH, 'utf-8')) as {
      added?: unknown;
      modified?: unknown;
    };

    const added = toNumberSet(raw?.added);
    const modified = toNumberSet(raw?.modified);

    /** 空数据一律返回空集合，让 hasChangelog 保持 false */
    if (added.size === 0 && modified.size === 0) return empty;

    return { added, modified };
  } catch (err) {
    console.warn(`[loadChangelog] failed to read changelog: ${(err as Error).message}`);
    return empty;
  }
}
