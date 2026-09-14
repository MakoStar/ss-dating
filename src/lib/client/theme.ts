import { STORAGE } from '../constants';

export type Theme = 'light' | 'dark';

/** 应用主题 */
export function applyTheme(theme: Theme, btn: HTMLElement): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  btn.title = theme === 'dark' ? 'Light' : 'Dark';
  try {
    localStorage.setItem(STORAGE.theme, theme);
  } catch {
    /* ignore */
  }
}

/** 获取当前主题 */
export function currentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}
