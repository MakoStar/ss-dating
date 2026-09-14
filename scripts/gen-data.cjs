const fs = require('fs');
const path = require('path');

const SS_DATA = path.resolve(__dirname, '../ss-data');
const DATA_DIR = path.resolve(__dirname, '../data');
const DATA_PATH = path.join(DATA_DIR, 'dating-events.json');
const CHANGELOG_PATH = path.join(DATA_DIR, 'changelog.json');

const AREAS = { CN: 'zh_CN', EN: 'en_US', JP: 'ja_JP', KR: 'ko_KR', TW: 'zh_TW'};
const TAG_COLOR = { 101: '#db6893', 102: '#7d81e3', 103: '#41cbaf' };
const GRADE = { 1: 5, 2: 4, 3: 3 };

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf-8'));

/** 加载指定区域和语言的数据 */
function loadArea(area, lang) {
  const binDir = path.join(SS_DATA, area, 'bin');
  const langDir = path.join(SS_DATA, area, 'language', lang);

  return {
    bin: {
      Character: readJson(path.join(binDir, 'Character.json')),
      DatingCharacterEvent: readJson(path.join(binDir, 'DatingCharacterEvent.json')),
      DatingLandmark: readJson(path.join(binDir, 'DatingLandmark.json')),
      DatingBranch: readJson(path.join(binDir, 'DatingBranch.json')),
      CharacterDes: readJson(path.join(binDir, 'CharacterDes.json')),
      CharacterTag: readJson(path.join(binDir, 'CharacterTag.json')),
    },
    lang: {
      Character: readJson(path.join(langDir, 'Character.json')),
      DatingLandmark: readJson(path.join(langDir, 'DatingLandmark.json')),
      DatingBranch: readJson(path.join(langDir, 'DatingBranch.json')),
      DatingCharacterEvent: readJson(path.join(langDir, 'DatingCharacterEvent.json')),
      CharacterDes: readJson(path.join(langDir, 'CharacterDes.json')),
      CharacterTag: readJson(path.join(langDir, 'CharacterTag.json')),
    },
    enCharacter: readJson(
      path.join(SS_DATA, 'EN', 'language', 'en_US', 'Character.json'),
    ),
  };
}

/** 计算指定区域和语言的邀约事件数据 */
function computeArea(area, lang) {
  const { bin, lang: L, enCharacter: EN_LAN_CHARACTER } = loadArea(area, lang);
  const result = {};

  for (const char of Object.values(bin.Character)) {
    if (!char.Visible) continue;

    const charId = char.Id;
    const charName = L.Character[char.Name] || '';
    const charGrade = GRADE[char.Grade] || 4;
    const charDes = bin.CharacterDes[char.Id] || '';
    const charTags = charDes?.Tag || [];
    const charTagColor = TAG_COLOR[charTags[0]] || '';
    const charJob = L.CharacterTag[bin.CharacterTag[charTags[0]]?.Title] || '';
    /** 这里需要拿英文角色名去 StellaSoraApi 请求角色头像 */
    const enCharName = EN_LAN_CHARACTER[char.Name] || '';

    const landmarks = {};
    for (const ev of Object.values(bin.DatingCharacterEvent)) {
      const [evCharId, landmarkId] = ev.DatingEventParams;
      if (evCharId !== charId) continue;

      const landmark = bin.DatingLandmark[landmarkId];
      const branch = bin.DatingBranch[`${landmarkId}001`];
      const optionKey = branch?.[`Option${ev.BranchTag}`];

      landmarks[landmarkId] = {
        charId,
        eventId: ev.Id,
        branchTag: ev.BranchTag,
        landmarkId,
        charName,
        charGrade,
        enCharName,
        charColor: charDes?.CharColor,
        charJob,
        charTagColor,
        eventCg: ev.CG,
        landmarkName: L.DatingLandmark[landmark?.Name] || '',
        eventName: L.DatingCharacterEvent[ev.Name] || '',
        eventClue: L.DatingCharacterEvent[ev.Clue] || '',
        eventOption: L.DatingBranch[optionKey] || '',
      };
    }

    if (Object.keys(landmarks).length > 0) {
      result[charId] = landmarks;
    }
  }

  return result;
}

/** 对象稳定序列化，保证 key 顺序一致 */
function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']';
  }
  const keys = Object.keys(value).sort();
  return (
    '{' +
    keys.map((k) => JSON.stringify(k) + ':' + stableStringify(value[k])).join(',') +
    '}'
  );
}

/** 将嵌套的对象数据扁平化为 Map，key 为 area:charId:landmarkId:eventId */
function flatten(data) {
  const map = new Map();
  if (!data || typeof data !== 'object') return map;

  for (const [area, chars] of Object.entries(data)) {
    if (!chars || typeof chars !== 'object') continue;
    for (const [charId, landmarks] of Object.entries(chars)) {
      if (!landmarks || typeof landmarks !== 'object') continue;
      for (const [landmarkId, ev] of Object.entries(landmarks)) {
        if (!ev || typeof ev !== 'object') continue;
        const eventId = ev.eventId;
        if (eventId == null) continue;
        map.set(`${area}:${charId}:${landmarkId}:${eventId}`, ev);
      }
    }
  }
  return map;
}

/** 对比新旧数据，返回新增、修改、移除的事件 ID */
function diffEvents(newData, oldData) {
  const newMap = flatten(newData);
  const oldMap = flatten(oldData);

  const addedIds = new Set();
  const modifiedIds = new Set();
  const removedIds = new Set();

  for (const [key, newEv] of newMap) {
    const oldEv = oldMap.get(key);
    if (!oldEv) {
      addedIds.add(newEv.eventId);
    } else if (stableStringify(newEv) !== stableStringify(oldEv)) {
      modifiedIds.add(newEv.eventId);
    }
  }

  for (const [key, oldEv] of oldMap) {
    if (!newMap.has(key)) removedIds.add(oldEv.eventId);
  }

  /** 已算新增的不再算修改 */
  for (const id of addedIds) modifiedIds.delete(id);

  return {
    changelog: {
      added: [...addedIds].sort((a, b) => a - b),
      modified: [...modifiedIds].sort((a, b) => a - b),
    },
    counts: {
      newTotal: newMap.size,
      oldTotal: oldMap.size,
      added: addedIds.size,
      modified: modifiedIds.size,
      removed: removedIds.size,
    },
  };
}


(async () => {
  /** 生成新数据 */
  const newData = {};
  for (const [area, lang] of Object.entries(AREAS)) {
    newData[area] = computeArea(area, lang);
  }

  /** 读旧数据 */
  let oldData = {};
  if (fs.existsSync(DATA_PATH)) {
    try {
      oldData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    } catch (err) {
      console.warn(`[gen] parse old data failed: ${err.message}`);
    }
  } else {
    console.warn(`[gen] old data not found: ${DATA_PATH}, treated as new data`);
  }

  /** 对比变更 */
  const { changelog, counts } = diffEvents(newData, oldData);

  /** 4. 确保 data 目录存在 */
  fs.mkdirSync(DATA_DIR, { recursive: true });

  /** 写入新数据覆盖旧的 */
  fs.writeFileSync(DATA_PATH, JSON.stringify(newData, null, 2));
  console.log(`[gen] written：${DATA_PATH}`);

  /** 写入 changelog.json */
  fs.writeFileSync(CHANGELOG_PATH, JSON.stringify(changelog, null, 2));
  console.log(`[gen] written：${CHANGELOG_PATH}`);

  /** 打印统计信息 */
  console.log('');
  console.log(`[gen] old data entry: ${counts.oldTotal}`);
  console.log(`[gen] new data entry: ${counts.newTotal}`);
  console.log(`[gen] added: ${counts.added}`);
  console.log(`[gen] modified: ${counts.modified}`);
  if (counts.removed > 0) {
    console.log(`[gen] removed: ${counts.removed}`);
  }
})();
