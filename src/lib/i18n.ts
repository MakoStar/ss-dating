export type MessageValue = string | ((n: number) => string);
export type UIDict = Record<string, MessageValue | undefined>;

export const CN_DICT: UIDict = {
  title: '角色邀约事件列表',
  subtitle: (n) => `共 ${n} 条事件，可按角色 / 地点 / 星级 / 职业筛选。`,
  allChars: '全部角色',
  allLandmarks: '全部地点',
  allGrades: '全部星级',
  allJobs: '全部职业',
  allEET: '全部元素类型',
  allChanges: '全部变更',
  changeAdded: '新增',
  changeModified: '修改',
  searchPlaceholder: '搜索事件名 / 线索 / 职业 / 角色ID(精确)…',
  reset: '重置',
  empty: '没有匹配的事件',
  footerThanks: '',
  footerAbout: '本仓库是一个角色邀约事件的可视化查询工具，支持多语言数据、星级与职业筛选，自动同步更新。',
  footerRepo: '本仓库源码',
  footerCopy: '仅供学习交流，版权归原游戏与数据提供方所有。',
  builtAt: '构建于：',
};

export const EN_DICT: UIDict = {
  title: 'Character Dating Event List',
  subtitle: (n) => `${n} events. Filter by character / landmark / rarity / role.`,
  allChars: 'All characters',
  allLandmarks: 'All landmarks',
  allGrades: 'All rarities',
  allJobs: 'All roles',
  allEET: 'All element types',
  allChanges: 'All changes',
  changeAdded: 'Added',
  changeModified: 'Modified',
  searchPlaceholder: 'Search event / clue / role / char ID (exact)…',
  reset: 'Reset',
  empty: 'No matching events',
  footerThanks: '',
  footerAbout: 'A visual query tool for character dating events. Supports multi-language data, rarity and role filters. Automatically synced and updated.',
  footerRepo: 'Source code',
  footerCopy: 'For learning and sharing only. All rights belong to the original game and data providers.',
  builtAt: 'Built on ',
};

export const JP_DICT: UIDict = {
  title: 'キャラクターデートイベント一覧',
  subtitle: (n) => `全 ${n} 件。キャラ / 場所 / レアリティ / 職種で絞り込み。`,
  allChars: 'すべてのキャラ',
  allLandmarks: 'すべての場所',
  allGrades: 'すべてのレアリティ',
  allJobs: 'すべての職種',
  allEET: 'すべての要素タイプ',
  allChanges: 'すべての変更',
  changeAdded: '新規',
  changeModified: '更新',
  searchPlaceholder: 'イベント / ヒント / 職種 / キャラID(完全一致)…',
  reset: 'リセット',
  empty: '該当するイベントがありません',
  footerThanks: '',
  footerAbout: 'キャラクターデートイベントのビジュアル検索ツールです。多言語データ、レアリティ・職種フィルターに対応。自動で同期・更新されます。',
  footerRepo: 'ソースコード',
  footerCopy: '学習・共有目的のみ。著作権は原作ゲームおよびデータ提供元に帰属します。',
  builtAt: 'ビルド日時：',
};

export const KR_DICT: UIDict = {
  title: '캐릭터 데이트 이벤트 목록',
  subtitle: (n) => `총 ${n}개. 캐릭터 / 장소 / 등급 / 직업으로 필터.`,
  allChars: '전체 캐릭터',
  allLandmarks: '전체 장소',
  allGrades: '전체 등급',
  allJobs: '전체 직업',
  allEET: '모든 요소 유형',
  allChanges: '전체 변경',
  changeAdded: '추가',
  changeModified: '수정',
  searchPlaceholder: '이벤트 / 힌트 / 직업 / 캐릭터 ID(정확히 일치)…',
  reset: '초기화',
  empty: '일치하는 이벤트가 없습니다',
  footerThanks: '',
  footerAbout: '캐릭터 데이트 이벤트 시각화 조회 도구입니다. 다국어 데이터, 등급 및 직업 필터를 지원하며 자동으로 동기화·업데이트됩니다.',
  footerRepo: '소스 코드',
  footerCopy: '학습 및 공유 목적만. 저작권은 원 게임과 데이터 제공자에게 있습니다.',
  builtAt: '빌드: ',
};

export const TW_DICT: UIDict = {
  title: '角色邀約事件列表',
  subtitle: (n) => `共 ${n} 條事件，可按角色 / 地點 / 星級 / 職業篩選。`,
  allChars: '全部角色',
  allLandmarks: '全部地點',
  allGrades: '全部星級',
  allJobs: '全部職業',
  allEET: '全部元素類型',
  allChanges: '全部變更',
  changeAdded: '新增',
  changeModified: '修改',
  searchPlaceholder: '搜尋事件名 / 線索 / 職業 / 角色ID(精確)…',
  reset: '重設',
  empty: '沒有符合的事件',
  footerThanks: '',
  footerAbout: '本倉庫是一個角色邀約事件的可視化查詢工具，支援多語言資料、星級與職業篩選，自動同步更新。',
  footerRepo: '本倉庫原始碼',
  footerCopy: '僅供學習交流，版權歸原遊戲與資料提供方所有。',
  builtAt: '建置於：',
};

export const UI: Record<string, UIDict> = {
  CN: CN_DICT,
  EN: EN_DICT,
  JP: JP_DICT,
  KR: KR_DICT,
  TW: TW_DICT,
};

/** 取某语言下的某 key 文案 */
export function t(lang: string, key: string, arg?: number): string {
  const dict: UIDict = UI[lang] ?? EN_DICT;
  const v = dict[key] ?? EN_DICT[key] ?? '';
  return typeof v === 'function' ? v(arg ?? 0) : v;
}
