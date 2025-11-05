/// <reference types="chrome"/>

export type OdooMode = 'developer' | 'consultant' | 'user' | 'news';
export type SearchMode = 'search' | 'ask';
export type Theme = 'light' | 'dark' | 'system';

export interface Bookmark {
  url: string;
  title: string;
  timestamp: number;
  tags: string[];
  notes: string;
  mode: string;
}

export interface PageInfo {
  url: string;
  title: string;
  timestamp: number;
}

export interface ChromeUserInfo {
  email: string;
  id: string;
}

export interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

export type SearchEngine = 'google' | 'bing' | 'duckduckgo' | 'yandex' | 'brave';
