import fs from 'node:fs';
import { DATING_EVENTS_PATH } from './paths';

export type RawData = Record<string, any>;

/** 加载邀约事件数据 */
export function loadDatingEvents(): RawData {
  if (!fs.existsSync(DATING_EVENTS_PATH)) {
    console.warn(`[loadDatingEvents] data file not found: ${DATING_EVENTS_PATH}, returning empty data`);
    return {};
  }
  /** 读取邀约事件数据 */
  try {
    const raw = fs.readFileSync(DATING_EVENTS_PATH, 'utf-8');
    return JSON.parse(raw) as RawData;
  } catch (err) {
    console.warn(`[loadDatingEvents] failed to parse data: ${(err as Error).message}`);
    return {};
  }
}
