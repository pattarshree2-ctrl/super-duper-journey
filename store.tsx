import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { translate, type BookmarkCategory, type DictKey, type Lang } from "./i18n";
import { openExternal, type ApiKeyId } from "./data";

export type View =
  | { name: "home" }
  | { name: "social" }
  | { name: "chat" }
  | { name: "create" }
  | { name: "smart" }
  | { name: "arena" }
  | { name: "bookmarks"; category?: BookmarkCategory }
  | { name: "settings" }
  | { name: "keys" }
  | { name: "privacy" }
  | { name: "about" }
  | { name: "notifications" }
  | { name: "explore"; q?: string }
  | { name: "tool"; tool: string };

export interface Bookmark {
  id: string;
  name: string;
  url: string;
  category: BookmarkCategory;
  createdAt: number;
}

export type ToastKind = "success" | "info" | "error";
export interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}

type Theme = "dark" | "light";

const KEYS_STORAGE = "aihub.keys.v1";
const BOOKMARKS_STORAGE = "aihub.bookmarks.v1";
const PREFS_STORAGE = "aihub.prefs.v1";
const SALT = "aihub-local-obfuscation-v1";

function xorTransform(value: string): string {
  let out = "";
  for (let i = 0; i < value.length; i += 1) {
    out += String.fromCharCode(value.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
  }
  return out;
}

function encodeKey(value: string): string {
  try {
    return btoa(xorTransform(encodeURIComponent(value)));
  } catch {
    return "";
  }
}

function decodeKey(value: string): string {
  try {
    return decodeURIComponent(xorTransform(atob(value)));
  } catch {
    return "";
  }
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be unavailable */
  }
}

function uid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

const seedBookmarks: Bookmark[] = [
  {
    id: "seed-arena",
    name: "Arena AI",
    url: "https://arena.ai/",
    category: "chat",
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: "seed-gemini",
    name: "Google Gemini",
    url: "https://gemini.google.com/app",
    category: "chat",
    createdAt: Date.now() - 1000 * 60 * 60 * 40,
  },
  {
    id: "seed-suno",
    name: "Suno Music Studio",
    url: "https://suno.com/",
    category: "music",
    createdAt: Date.now() - 1000 * 60 * 60 * 58,
  },
  {
    id: "seed-gmail",
    name: "Gmail",
    url: "https://mail.google.com/",
    category: "others",
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
  },
];

interface Prefs {
  lang: Lang;
  theme: Theme;
  notifications: boolean;
}

interface AppContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  notifications: boolean;
  setNotifications: (on: boolean) => void;
  t: (key: DictKey) => string;
  keys: Partial<Record<ApiKeyId, string>>;
  saveKey: (id: ApiKeyId, value: string) => void;
  removeKey: (id: ApiKeyId) => void;
  configuredCount: number;
  bookmarks: Bookmark[];
  addBookmark: (input: { name: string; url: string; category: BookmarkCategory }) => void;
  updateBookmark: (id: string, patch: Partial<Omit<Bookmark, "id">>) => void;
  removeBookmark: (id: string) => void;
  toasts: Toast[];
  pushToast: (message: string, kind?: ToastKind) => void;
  dismissToast: (id: number) => void;
  stack: View[];
  view: View;
  navigate: (view: View) => void;
  goBack: () => void;
  switchTab: (view: View) => void;
  launch: (url: string) => boolean;
  copyText: (text: string, successMessage?: string) => void;
  resetLocalData: () => void;
  basePrefs: Prefs;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const prefs = readJson<Partial<Prefs>>(PREFS_STORAGE, {});
    return prefs.lang === "kn" ? "kn" : "en";
  });
  const [theme, setThemeState] = useState<Theme>(() => {
    const prefs = readJson<Partial<Prefs>>(PREFS_STORAGE, {});
    return prefs.theme === "light" ? "light" : "dark";
  });
  const [notifications, setNotificationsState] = useState<boolean>(() => {
    const prefs = readJson<Partial<Prefs>>(PREFS_STORAGE, {});
    return prefs.notifications !== false;
  });
  const [keys, setKeys] = useState<Partial<Record<ApiKeyId, string>>>(() => {
    const stored = readJson<Record<string, string>>(KEYS_STORAGE, {});
    const next: Partial<Record<ApiKeyId, string>> = {};
    (Object.keys(stored) as ApiKeyId[]).forEach((id) => {
      const decoded = decodeKey(stored[id]);
      if (decoded) next[id] = decoded;
    });
    return next;
  });
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const stored = readJson<Bookmark[] | null>(BOOKMARKS_STORAGE, null);
    return Array.isArray(stored) ? stored : seedBookmarks;
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const [stack, setStack] = useState<View[]>([{ name: "home" }]);

  useEffect(() => {
    writeJson(PREFS_STORAGE, { lang, theme, notifications });
  }, [lang, theme, notifications]);

  useEffect(() => {
    const encoded: Record<string, string> = {};
    (Object.keys(keys) as ApiKeyId[]).forEach((id) => {
      const value = keys[id];
      if (value) encoded[id] = encodeKey(value);
    });
    writeJson(KEYS_STORAGE, encoded);
  }, [keys]);

  useEffect(() => {
    writeJson(BOOKMARKS_STORAGE, bookmarks);
  }, [bookmarks]);

  const t = useCallback((key: DictKey) => translate(lang, key), [lang]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const pushToast = useCallback((message: string, kind: ToastKind = "success") => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts((prev) => [...prev.slice(-2), { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  const copyText = useCallback(
    (text: string, successMessage?: string) => {
      const value = text ?? "";
      if (!value) return;
      const fallback = () => {
        try {
          const area = document.createElement("textarea");
          area.value = value;
          area.style.position = "fixed";
          area.style.opacity = "0";
          document.body.appendChild(area);
          area.select();
          document.execCommand("copy");
          document.body.removeChild(area);
          pushToast(successMessage ?? translate(lang, "copied"));
        } catch {
          pushToast(translate(lang, "copied"), "info");
        }
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText(value)
          .then(() => pushToast(successMessage ?? translate(lang, "copied")))
          .catch(fallback);
      } else {
        fallback();
      }
    },
    [lang, pushToast],
  );

  const launch = useCallback(
    (url: string) => {
      const ok = openExternal(url);
      pushToast(ok ? translate(lang, "linkOpened") : translate(lang, "popupBlocked"), ok ? "info" : "error");
      return ok;
    },
    [lang, pushToast],
  );

  const setLang = useCallback(
    (next: Lang) => {
      setLangState(next);
      pushToast(next === "kn" ? "ಭಾಷೆ ಬದಲಾಗಿದೆ" : "Language set to English", "success");
    },
    [pushToast],
  );

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setNotifications = useCallback(
    (on: boolean) => {
      setNotificationsState(on);
      pushToast(
        on ? translate(lang, "notificationsOn") : translate(lang, "notificationsOff"),
        on ? "success" : "info",
      );
    },
    [lang, pushToast],
  );

  const saveKey = useCallback(
    (id: ApiKeyId, value: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        pushToast(translate(lang, "keyEmpty"), "error");
        return;
      }
      setKeys((prev) => ({ ...prev, [id]: trimmed }));
      pushToast(translate(lang, "keySaved"));
    },
    [lang, pushToast],
  );

  const removeKey = useCallback(
    (id: ApiKeyId) => {
      setKeys((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      pushToast(translate(lang, "keyDeleted"), "info");
    },
    [lang, pushToast],
  );

  const addBookmark = useCallback(
    (input: { name: string; url: string; category: BookmarkCategory }) => {
      const item: Bookmark = {
        id: uid(),
        name: input.name.trim(),
        url: input.url,
        category: input.category,
        createdAt: Date.now(),
      };
      setBookmarks((prev) => [item, ...prev]);
      pushToast(translate(lang, "bookmarkAdded"));
    },
    [lang, pushToast],
  );

  const updateBookmark = useCallback(
    (id: string, patch: Partial<Omit<Bookmark, "id">>) => {
      setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
      pushToast(translate(lang, "bookmarkUpdated"));
    },
    [lang, pushToast],
  );

  const removeBookmark = useCallback(
    (id: string) => {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      pushToast(translate(lang, "bookmarkDeleted"), "info");
    },
    [lang, pushToast],
  );

  const navigate = useCallback((next: View) => {
    setStack((prev) => [...prev, next]);
  }, []);

  const goBack = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : [{ name: "home" }]));
  }, []);

  const switchTab = useCallback((next: View) => {
    setStack([next]);
  }, []);

  const resetLocalData = useCallback(() => {
    setKeys({});
    setBookmarks(seedBookmarks);
    setLangState("en");
    setThemeState("dark");
    setNotificationsState(true);
    pushToast(lang === "kn" ? "ಸ್ಥಳೀಯ ಡೇಟಾ ಮರುಹೊಂದಿಸಲಾಗಿದೆ" : "Local data reset", "info");
  }, [lang, pushToast]);

  const configuredCount = useMemo(
    () => (Object.keys(keys) as ApiKeyId[]).filter((id) => Boolean(keys[id])).length,
    [keys],
  );

  const value: AppContextValue = {
    lang,
    setLang,
    theme,
    setTheme,
    toggleTheme,
    notifications,
    setNotifications,
    t,
    keys,
    saveKey,
    removeKey,
    configuredCount,
    bookmarks,
    addBookmark,
    updateBookmark,
    removeBookmark,
    toasts,
    pushToast,
    dismissToast,
    stack,
    view: stack[stack.length - 1],
    navigate,
    goBack,
    switchTab,
    launch,
    copyText,
    resetLocalData,
    basePrefs: { lang, theme, notifications },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
