import { t } from '../i18n';
import { STORAGE } from '../constants';
import type { ChangeType, SelectEntry } from '../types';
import { $, readAreaCounts } from './dom';
import { applyTheme, currentTheme } from './theme';
import { applyUiLang } from './i18n';
import { fillSelect, matchesQuery, byIdDesc } from './filters';

interface AppState {
  area: string;
  charId: string;
  landmarkId: string;
  grade: string;
  job: string;
  eet: string;
  change: ChangeType;
  q: string;
}

/** 初始化应用 */
export function initApp(): void {
  const areaCounts = readAreaCounts();

  const navBrandSelect = $<HTMLSpanElement>('.nav-brand-text');
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.card'));
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('.tab'));
  const charSelect = $<HTMLSelectElement>('#char-filter');
  const landmarkSelect = $<HTMLSelectElement>('#landmark-filter');
  const gradeSelect = document.querySelector<HTMLSelectElement>('#grade-filter');
  const jobSelect = document.querySelector<HTMLSelectElement>('#job-filter');
  const eetSelect = document.querySelector<HTMLSelectElement>('#eet-filter');
  const changeSelect = document.querySelector<HTMLSelectElement>('#change-filter');
  const searchInput = $<HTMLInputElement>('#search');
  const searchClear = document.querySelector<HTMLButtonElement>('#search-clear');
  const resetBtn = $<HTMLButtonElement>('#reset');
  const emptyEl = $<HTMLElement>('#empty');
  const themeBtn = $<HTMLButtonElement>('#theme-toggle');

  /** 应用状态 */
  const state: AppState = {
    area: tabs[0]?.dataset.area ?? 'CN',
    charId: '',
    landmarkId: '',
    grade: '',
    job: '',
    eet: '',
    change: '',
    q: '',
  };

  /** 同步搜索框清除按钮的显示状态 */
  function syncSearchClear(): void {
    if (!searchClear) return;
    searchClear.hidden = searchInput.value.length === 0;
  }

  /** 重建筛选选项 */
  function rebuildOptions(): void {
    const lang = state.area;
    const charMap = new Map<string, SelectEntry>();
    const landmarkMap = new Map<string, SelectEntry>();
    const gradeSet = new Set<string>();
    const jobMap = new Map<string, string>();
    const eetMap = new Map<string, string>();

    /** 遍历所有卡片，统计筛选选项 */
    for (const c of cards) {
      if (c.dataset.area !== state.area) continue;

      const charId = c.dataset.charId ?? '';
      const charName = c.dataset.charName ?? '';
      const landmarkId = c.dataset.landmarkId ?? '';
      const landmarkName = c.dataset.landmarkName ?? '';
      const grade = c.dataset.charGrade ?? '';
      const job = c.dataset.charJob ?? '';
      /** 
        * 注意: 这里 dataset 有坑 (charJobNum)
        * 如果是这种带多个大写字母的小驼峰
        * 在第二个之后会全部拍平成小写,转成了 charJobnum  
        */
      const jobNum = c.dataset.charJobnum ?? '';
      /** 这里 charEET 转成了 charEet  */
      const eet = c.dataset.charEet ?? '';
      const eetNum = c.dataset.charEetnum ?? '';
      const ce = charMap.get(charId) ?? { label: `${charId} ${charName}` || charId, count: 0 };
      ce.count++;
      charMap.set(charId, ce);

      const le = landmarkMap.get(landmarkId) ?? { label: landmarkName || landmarkId, count: 0 };
      le.count++;
      landmarkMap.set(landmarkId, le);

      if (grade) gradeSet.add(grade);
      if (job) jobMap.set(jobNum, job);
      if (eet && eetNum) eetMap.set(eetNum, eet);
    }

    /** 更新角色筛选选项 */
    fillSelect(charSelect, new Map([...charMap].sort(byIdDesc)), t(lang, 'allChars'));

    /** 更新地点筛选选项 */
    fillSelect(
      landmarkSelect,
      new Map([...landmarkMap].sort(byIdDesc)),
      t(lang, 'allLandmarks'),
      (id, entry) => `${entry.label} (${id})`,
    );

    /** 更新等级筛选选项 */
    if (gradeSelect) {
      const grades = [...gradeSet].sort((a, b) => Number(b) - Number(a));
      const current = gradeSelect.value;
      gradeSelect.innerHTML = '';

      const first = document.createElement('option');
      first.value = '';
      first.textContent = t(lang, 'allGrades');
      gradeSelect.appendChild(first);

      for (const g of grades) {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = '★'.repeat(Math.max(1, Math.min(6, Number(g))));
        // opt.textContent = g;
        gradeSelect.appendChild(opt);
      }

      gradeSelect.value = current && grades.includes(current) ? current : '';
    }

    /** 更新职业筛选选项 */
    if (jobSelect) {
      // const jobs = [...jobMap].sort((a, b) =>
      //   a.localeCompare(b, undefined, { numeric: true }),
      // );
      const jobs = [...jobMap]
        .sort(([n1], [n2]) => Number(n1) - Number(n2))
        .map(([, t]) => t);
        
      const current = jobSelect.value;
      jobSelect.innerHTML = '';

      const first = document.createElement('option');
      first.value = '';
      first.textContent = t(lang, 'allJobs');
      jobSelect.appendChild(first);

      for (const j of jobs) {
        const opt = document.createElement('option');
        opt.value = j;
        opt.textContent = j;
        jobSelect.appendChild(opt);
      }

      jobSelect.value = current && jobs.includes(current) ? current : '';
    }

    /** 更新元素类型筛选选项 */
    if (eetSelect) {
      /** 这里使用 EET 元素类型的数字顺序排序 */
      const eets = [...eetMap]
        .sort(([n1], [n2]) => Number(n1) - Number(n2))
        .map(([, t]) => t);
      
      const current = eetSelect.value;
      eetSelect.innerHTML = '';

      const first = document.createElement('option');
      first.value = '';
      first.textContent = t(lang, 'allEET');
      eetSelect.appendChild(first);

      for (const j of eets) {
        const opt = document.createElement('option');
        opt.value = j;
        opt.textContent = j;
        eetSelect.appendChild(opt);
      }

      eetSelect.value = current && eets.includes(current) ? current : '';
    }

    /** 更新变更类型筛选选项 */
    if (changeSelect) {
      const opts = changeSelect.querySelectorAll('option');
      if (opts[0]) opts[0].textContent = t(lang, 'allChanges');
      if (opts[1]) opts[1].textContent = t(lang, 'changeAdded');
      if (opts[2]) opts[2].textContent = t(lang, 'changeModified');
    }

    resetBtn.textContent = t(lang, 'reset');
  }

  /** 应用筛选条件 */
  function applyFilters(): void {
    const tokens = state.q.split(/\s+/).filter(Boolean);
    let visible = 0;

    for (const c of cards) {
      const ok =
        c.dataset.area === state.area &&
        (!state.charId || c.dataset.charId === state.charId) &&
        (!state.landmarkId || c.dataset.landmarkId === state.landmarkId) &&
        (!state.grade || c.dataset.charGrade === state.grade) &&
        (!state.job || c.dataset.charJob === state.job) &&
        (!state.eet || c.dataset.charEet === state.eet) &&
        (!state.change || c.dataset.change === state.change) &&
        matchesQuery(c, tokens);
      c.hidden = !ok;
      if (ok) visible++;
    }
    emptyEl.hidden = visible > 0;
  }

  /** 设置当前选中的标签页 */
  function setActiveTab(area: string): void {
    for (const tab of tabs) {
      tab.setAttribute('aria-selected', String(tab.dataset.area === area));
    }
  }

  /** 重置二级筛选条件 */
  function resetSecondary(): void {
    state.charId = '';
    state.landmarkId = '';
    state.grade = '';
    state.job = '';
    state.eet = '';
    state.change = '';
    state.q = '';
    searchInput.value = '';
    syncSearchClear();
    charSelect.value = '';
    landmarkSelect.value = '';
    if (gradeSelect) gradeSelect.value = '';
    if (jobSelect) jobSelect.value = '';
    if (eetSelect) eetSelect.value = '';
    if (changeSelect) changeSelect.value = '';
  }

  /** 重新播放卡片动画 */
  function replayCards(): void {
    const visible = cards.filter((c) => !c.hidden);
    visible.forEach((c, i) => {
      c.style.setProperty('--i', String(Math.min(i, 24)));
      c.style.animation = 'none';
      void c.offsetWidth;
      c.style.animation = '';
    });
  }

  /** 切换标签页 */
  function switchArea(area: string): void {
    state.area = area;
    try {
      localStorage.setItem(STORAGE.area, area);
    } catch {
      /* ignore */
    }
    setActiveTab(area);
    applyUiLang(area, areaCounts[area] ?? 0);
    resetSecondary();
    rebuildOptions();
    applyFilters();
    replayCards();
  }

  /** Nova 文页面触发事件 */
  navBrandSelect.addEventListener('dblclick', () => {
    const bodyElement = $<HTMLBodyElement>('body');
    const titleElement = $<HTMLTitleElement>('title');
    if (!navBrandSelect.dataset.nova) {
      tabs.forEach(el => el.dataset.area !== "EN" && (el.style.display = 'none'));
      switchArea('EN');
      bodyElement.classList.add('font-Nova');
      navBrandSelect.dataset.nova = titleElement.textContent;
      titleElement.textContent = 'Nova Font Dating Events';
      navBrandSelect.textContent = 'StellaSora Nova Font Page';
    } else {
      titleElement.textContent = navBrandSelect.dataset.nova;
      delete navBrandSelect.dataset.nova;
      tabs.forEach(el => el.style.display = '');
      switchArea('CN');
      bodyElement.classList.remove('font-Nova');
      navBrandSelect.textContent = 'Stella';
    }
  });

  /** 事件绑定 */
  for (const tab of tabs) {
    tab.addEventListener('click', () => switchArea(tab.dataset.area ?? 'CN'));
  }

  /** 筛选条件变化事件绑定 */
  charSelect.addEventListener('change', () => {
    state.charId = charSelect.value;
    applyFilters();
  });

  /** 筛选条件变化事件绑定 */
  landmarkSelect.addEventListener('change', () => {
    state.landmarkId = landmarkSelect.value;
    applyFilters();
  });

  /** 筛选条件变化事件绑定 */
  if (gradeSelect) {
    gradeSelect.addEventListener('change', () => {
      state.grade = gradeSelect.value;
      applyFilters();
    });
  }

  /** 筛选条件变化事件绑定 */
  if (jobSelect) {
    jobSelect.addEventListener('change', () => {
      state.job = jobSelect.value;
      applyFilters();
    });
  }

  /** 筛选条件变化事件绑定 */
  if (eetSelect) {
    eetSelect.addEventListener('change', () => {
      state.eet = eetSelect.value;
      applyFilters();
    });
  }

  /** 筛选条件变化事件绑定 */
  if (changeSelect) {
    changeSelect.addEventListener('change', () => {
      state.change = (changeSelect.value as ChangeType) ?? '';
      applyFilters();
    });
  }

  /** 搜索框输入事件绑定 */
  searchInput.addEventListener('input', () => {
    state.q = searchInput.value.trim().toLowerCase();
    syncSearchClear();
    applyFilters();
  });

  /** 搜索框按键事件绑定 */
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      state.q = '';
      syncSearchClear();
      applyFilters();
      searchInput.blur();
    }
  });

  /** 全局按键事件绑定 */
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  /** 搜索框清除按钮事件绑定 */
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      state.q = '';
      syncSearchClear();
      applyFilters();
      searchInput.focus();
    });
  }

  /** 重置按钮事件绑定 */
  resetBtn.addEventListener('click', () => {
    resetSecondary();
    rebuildOptions();
    applyFilters();
    replayCards();
  });

  /** 主题切换按钮事件绑定 */
  themeBtn.addEventListener('click', () => {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', themeBtn);
  });

  /** 初始化 */
  applyTheme(currentTheme(), themeBtn);

  /** 读取上次选中的标签页 */
  const savedArea = (() => {
    try {
      return localStorage.getItem(STORAGE.area);
    } catch {
      return null;
    }
  })();

  /** 确定初始标签页 */
  const initialArea = savedArea && tabs.some((tab) => tab.dataset.area === savedArea)
    ? savedArea
    : state.area;

  /** 切换到初始标签页 */
  switchArea(initialArea);
  syncSearchClear();
}
