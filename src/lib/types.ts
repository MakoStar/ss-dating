export type ChangeType = 'added' | 'modified' | '';

export interface Row {
  area: string;
  charId: number;
  charName?: string;
  enCharName?: string;
  charGrade?: number;
  charColor?: string;
  charJob?: string;
  charJobNum?: number;
  charEETNum?: number;
  charEET?: string;
  charEETColor?: string;
  charTagColor?: string;
  landmarkId: number;
  landmarkName?: string;
  eventId: number;
  branchTag?: number;
  eventCg?: string;
  eventName?: string;
  eventClue?: string;
  eventOption?: string;
  searchIndex: string;
  changeType: ChangeType;
}

export interface SelectEntry {
  label: string;
  count: number;
}
