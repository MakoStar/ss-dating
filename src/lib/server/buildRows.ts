import type { ChangeType, Row } from '../types';
import { loadChangelog } from './changelog';
import { loadDatingEvents } from './loadData';

/** 构建行数据的结果 */
export interface BuildRowsResult {
  rows: Row[];
  areaCounts: Record<string, number>;
  hasGrade: boolean;
  hasJob: boolean;
  hasChangelog: boolean;
}

/** 构建行数据 */
export function buildRows(): BuildRowsResult {
  const data = loadDatingEvents();
  const { added: addedSet, modified: modifiedSet } = loadChangelog();
  const hasChangelog = addedSet.size > 0 || modifiedSet.size > 0;

  const rows: Row[] = [];
  /** 遍历数据，构建行数据 */
  for (const [area, chars] of Object.entries(data)) {
    for (const char of Object.values(chars as Record<string, any>)) {
      for (const ev of Object.values(char as Record<string, any>)) {
        const e = ev as Omit<Row, 'area' | 'searchIndex' | 'changeType'>;
        let changeType: ChangeType = '';
        if (addedSet.has(e.eventId)) changeType = 'added';
        else if (modifiedSet.has(e.eventId)) changeType = 'modified';

        rows.push({
          area,
          ...e,
          changeType,
          searchIndex: [
            e.charName,
            e.charJob,
            e.landmarkName,
            e.eventName,
            e.eventClue,
            e.eventOption,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase(),
        });
      }
    }
  }

  /** 统计每个地区的行数 */
  const areaCounts: Record<string, number> = {};
  for (const r of rows) {
    areaCounts[r.area] = (areaCounts[r.area] ?? 0) + 1;
  }

  return {
    rows,
    areaCounts,
    hasGrade: rows.some((r) => r.charGrade != null && !Number.isNaN(r.charGrade)),
    hasJob: rows.some((r) => !!r.charJob),
    hasChangelog,
  };
}
