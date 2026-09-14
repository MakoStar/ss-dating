import path from 'node:path';

/** 邀约事件数据文件名 */
const DATING_EVENTS_DATA_FILE = 'dating-events.json';
const CHANGELOG_DATA_FILE = 'changelog.json';

/** 数据目录: 默认：项目根目录下的 data/, 可用环境变量 DATA_DIR 覆盖 */
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(process.cwd(), 'data');

export const DATING_EVENTS_PATH = path.join(DATA_DIR, DATING_EVENTS_DATA_FILE);
export const CHANGELOG_PATH = path.join(DATA_DIR, CHANGELOG_DATA_FILE);
export const DATA_DIR_RESOLVED = DATA_DIR;
