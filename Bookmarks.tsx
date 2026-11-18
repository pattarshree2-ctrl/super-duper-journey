import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bookmark as BookmarkIcon,
  BookmarkPlus,
  Check,
  ExternalLink,
  Folder,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useApp, type Bookmark } from "../store";
import { bmCategories, type BookmarkCategory } from "../i18n";
import { Btn, EmptyState, Field, IconBtn, Notice, ScreenHeader, Sheet } from "../components/ui";
import { normalizeUrl } from "../data";

function categoryMeta(id: BookmarkCategory) {
  return bmCategories.find((c) => c.id === id) ?? bmCategories[bmCategories.length - 1];
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function BookmarksScreen() {
  const { bookmarks, addBookmark, updateBookmark, removeBookmark, t, lang, launch, view, navigate } = useApp();
  const initialCategory = view.name === "bookmarks" && view.category ? view.category : "all";
  const [category, setCategory] = useState<BookmarkCategory | "all">(initialCategory);
  const [query, setQuery] = useState("");
  const [sortRecent, setSortRecent] = useState(true);
  const [editing, setEditing] = useState<Bookmark | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<Bookmark | null>(null);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [cat, setCat] = useState<BookmarkCategory>("chat");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookmarks
      .filter((b) => (category === "all" ? true : b.category === category))
      .filter((b) => (q ? b.name.toLowerCase().includes(q) || b.url.toLowerCase().includes(q) : true))
      .sort((a, b) => (sortRecent ? b.createdAt - a.createdAt : a.name.localeCompare(b.name)));
  }, [bookmarks, category, query, sortRecent]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    bookmarks.forEach((b) => {
      map[b.category] = (map[b.category] ?? 0) + 1;
    });
    return map;
  }, [bookmarks]);

  const openAdd = () => {
    setName("");
    setUrl("");
    setCat(category === "all" ? "chat" : category);
    setAdding(true);
  };

  const openEdit = (bookmark: Bookmark) => {
    setName(bookmark.name);
    setUrl(bookmark.url);
    setCat(bookmark.category);
    setEditing(bookmark);
  };

  const { pushToast } = useApp();

  const submit = (mode: "add" | "edit") => {
    const trimmedName = name.trim();
    const normalized = normalizeUrl(url);
    if (!trimmedName) {
      pushToast(t("nameRequired"), "error");
      return;
    }
    if (!normalized) {
      pushToast(t("urlRequired"), "error");
      return;
    }
    if (mode === "add") addBookmark({ name: trimmedName, url: normalized, category: cat });
    else if (editing) updateBookmark(editing.id, { name: trimmedName, url: normalized, category: cat });
    setAdding(false);
    setEditing(null);
  };

  const formFields = (
    <div className="space-y-3">
      <Field label={t("name")} placeholder="Arena AI" value={name} onChange={(e) => setName(e.target.value)} />
      <Field label={t("websiteUrl")} placeholder="https://arena.ai/" value={url} onChange={(e) => setUrl(e.target.value)} inputMode="url" />
      <div>
        <p className="mb-1.5 text-[10.5px] font-bold text-soft">{t("category")}</p>
        <div className="flex flex-wrap gap-1.5">
          {bmCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              className={`rounded-full border px-2.5 py-1.5 text-[9.5px] font-bold transition ${
                cat === c.id ? "border-transparent text-[#100a1e]" : "border-hair bg-white/[0.03] text-muted-app"
              }`}
              style={cat === c.id ? { background: c.color } : undefined}
            >
              {lang === "kn" ? c.kn : c.en}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="screen-in pb-4">
      <ScreenHeader
        title={t("bookmarks")}
        subtitle={`${bookmarks.length} ${t("bookmarkCount")} · ${t("local")}`}
        accent="#fbbf24"
        right={
          <button
            type="button"
            onClick={openAdd}
            aria-label={t("bookmarkTitle")}
            className="press flex h-9 w-9 items-center justify-center rounded-xl neon-gradient text-white shadow-[0_8px_20px_-8px_#a855f7]"
          >
            <Plus className="h-4 w-4" />
          </button>
        }
      />
      <div className="px-5">
        <div className="relative overflow-hidden rounded-2xl border border-amber-300/20 bg-[linear-gradient(120deg,#2a2010,#241a2e_58%,#171a38)] p-4">
          <div className="absolute -top-10 -right-4 h-28 w-28 rounded-full bg-amber-400/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-amber-300">
              <BookmarkIcon className="h-5 w-5" fill="currentColor" fillOpacity={0.25} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[13px] font-extrabold text-white">{lang === "kn" ? t("yourBookmarks") : "Your bookmarks"}</p>
              <p className="mt-0.5 text-[9px] text-white/60">
                {lang === "kn" ? "ಸಂಘಟಿತವಾಗಿ, ಯಾವಾಗಲೂ ಒಂದೇ ಕ್ಲಿಕ್ ದೂರ" : "Organised by category, always one tap away"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-[22px] leading-none font-extrabold text-amber-300">{bookmarks.length}</p>
              <p className="mt-0.5 text-[7.5px] font-bold tracking-wide text-white/50 uppercase">{t("saved")}</p>
            </div>
          </div>
          <div className="relative mt-3 flex flex-wrap gap-1.5">
            {bmCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.07] px-2 py-1 text-[8px] font-bold text-white/80"
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
                {lang === "kn" ? c.kn : c.en}
                <span className="text-white/45">{counts[c.id] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-hair bg-[var(--surface)] px-3 py-2.5">
            <Search className="h-3.5 w-3.5 shrink-0 text-amber-300" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchBookmarks")}
              className="min-w-0 flex-1 bg-transparent text-[11px] text-app outline-none placeholder:text-[var(--muted)]"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label={t("clear")} className="text-muted-app">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSortRecent((v) => !v)}
            className="press flex h-[38px] shrink-0 items-center gap-1 rounded-xl border border-hair bg-white/[0.03] px-2.5 text-[9px] font-bold text-soft"
          >
            {sortRecent ? t("newest") : t("sortAz")}
          </button>
        </div>

        <div className="scroll-hide -mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`press shrink-0 rounded-full border px-3 py-1.5 text-[9.5px] font-bold ${
              category === "all" ? "border-transparent bg-[linear-gradient(120deg,#8b5cf6,#ec4899)] text-white" : "border-hair bg-white/[0.03] text-muted-app"
            }`}
          >
            {t("all")} · {bookmarks.length}
          </button>
          {bmCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className="press flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-[9.5px] font-bold"
              style={
                category === c.id
                  ? { borderColor: "transparent", background: c.color, color: "#100a1e" }
                  : { borderColor: "var(--line)", color: "var(--muted)" }
              }
            >
              {lang === "kn" ? c.kn : c.en} · {counts[c.id] ?? 0}
            </button>
          ))}
        </div>

        <div className="mt-3 space-y-2">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<BookmarkIcon className="h-5 w-5" />}
              title={t("noBookmarks")}
              body={t("noBookmarksHint")}
              action={
                <Btn size="sm" onClick={openAdd}>
                  <BookmarkPlus className="h-3 w-3" /> {t("addFirstBookmark")}
                </Btn>
              }
            />
          ) : (
            filtered.map((b) => {
              const meta = categoryMeta(b.category);
              return (
                <div key={b.id} className="group flex items-center gap-2.5 rounded-2xl border border-hair bg-[var(--surface)] p-2.5 transition hover:border-white/20">
                  <button
                    type="button"
                    onClick={() => launch(b.url)}
                    className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                  >
                    <span
                      className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 text-[13px] font-extrabold"
                      style={{ background: `${meta.color}1c`, color: meta.color }}
                    >
                      {b.name.slice(0, 1).toUpperCase()}
                      <Folder className="absolute -right-1 -bottom-1 h-4 w-4 opacity-30" style={{ fill: meta.color }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11.5px] font-extrabold text-app">{b.name}</span>
                      <span className="mt-0.5 flex items-center gap-1 truncate text-[8.5px] text-muted-app">
                        <ExternalLink className="h-2.5 w-2.5 shrink-0" /> {hostOf(b.url)}
                      </span>
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-[1px] text-[7.5px] font-bold" style={{ background: `${meta.color}18`, color: meta.color }}>
                        {lang === "kn" ? meta.kn : meta.en}
                      </span>
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    <IconBtn label={t("edit")} onClick={() => openEdit(b)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn label={t("delete")} onClick={() => setDeleting(b)} className="text-rose-400 hover:bg-rose-500/10">
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconBtn>
                    <button
                      type="button"
                      onClick={() => launch(b.url)}
                      aria-label={t("open")}
                      className="press flex h-8 w-8 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/10 text-violet-300"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4">
          <Notice tone="green" icon={<ShieldCheck className="h-4 w-4" />}>
            {lang === "kn"
              ? "ಬುಕ್‌ಮಾರ್ಕ್‌ಗಳು ಈ ಸಾಧನದ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತ್ರ ಉಳಿಯುತ್ತವೆ. ಯಾವುದೇ ಖಾತೆ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ಸಂಗ್ರಹವಿಲ್ಲ."
              : "Bookmarks live in this browser only. No account, no tracking and no saved passwords."}
          </Notice>
        </div>
        <div className="mt-3 flex gap-2">
          <Btn size="sm" variant="outline" className="flex-1" onClick={openAdd}>
            <BookmarkPlus className="h-3 w-3" /> {t("add")}
          </Btn>
          <Btn size="sm" variant="outline" className="flex-1" onClick={() => navigate({ name: "tool", tool: "search" })}>
            <Search className="h-3 w-3" /> {t("searchWeb")}
          </Btn>
        </div>
      </div>

      <Sheet
        open={adding || Boolean(editing)}
        onClose={() => {
          setAdding(false);
          setEditing(null);
        }}
        title={editing ? t("bookmarkEdit") : t("bookmarkTitle")}
        footer={
          <Btn size="lg" onClick={() => submit(editing ? "edit" : "add")}>
            <Check className="h-3.5 w-3.5" /> {editing ? t("save") : t("saveBookmark")}
          </Btn>
        }
      >
        {formFields}
      </Sheet>

      <Sheet
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={t("deleteBookmark")}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Btn variant="outline" onClick={() => setDeleting(null)}>
              {t("cancel")}
            </Btn>
            <Btn
              variant="danger"
              onClick={() => {
                if (deleting) removeBookmark(deleting.id);
                setDeleting(null);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" /> {t("delete")}
            </Btn>
          </div>
        }
      >
        <p className="text-[11px] leading-relaxed text-muted-app">{t("deleteBookmarkBody")}</p>
        {deleting && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-hair bg-white/[0.03] p-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${categoryMeta(deleting.category).color}20`, color: categoryMeta(deleting.category).color }}>
              {deleting.name.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[10.5px] font-bold text-app">{deleting.name}</p>
              <p className="truncate text-[8.5px] text-muted-app">{hostOf(deleting.url)}</p>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
