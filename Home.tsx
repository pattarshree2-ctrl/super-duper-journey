import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  Folder,
  Info,
  Languages,
  LayoutGrid,
  Lock,
  Menu,
  Moon,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import { useApp } from "../store";
import { BrandIcon, LogoMark } from "../components/Brand";
import { MenuRow, SectionHead, ServiceTile, Sheet } from "../components/ui";
import { homeSections, type Service } from "../data";
import { bmCategories } from "../i18n";

export function useServiceLaunch() {
  const { navigate, launch } = useApp();
  return (service: Service) => {
    if (service.url.startsWith("#tool/")) {
      navigate({ name: "tool", tool: service.url.replace("#tool/", "") });
      return;
    }
    if (service.url === "#bookmarks") {
      navigate({ name: "bookmarks" });
      return;
    }
    launch(service.url);
  };
}

function greetingKey(): "goodMorning" | "goodAfternoon" | "goodEvening" {
  const h = new Date().getHours();
  if (h < 12) return "goodMorning";
  if (h < 17) return "goodAfternoon";
  return "goodEvening";
}

export default function HomeScreen() {
  const { t, lang, theme, toggleTheme, setLang, bookmarks, navigate, notifications, launch } = useApp();
  const openService = useServiceLaunch();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);

  const dateLabel = useMemo(() => {
    const locale = lang === "kn" ? "kn-IN" : "en-GB";
    return new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "short" }).format(new Date());
  }, [lang]);

  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    bookmarks.forEach((b) => {
      counts[b.category] = (counts[b.category] ?? 0) + 1;
    });
    return counts;
  }, [bookmarks]);

  const submitSearch = () => {
    if (!query.trim()) {
      navigate({ name: "explore" });
      return;
    }
    navigate({ name: "explore", q: query.trim() });
    setQuery("");
  };

  return (
    <div className="pb-2">
      {/* header */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-hair bg-[var(--app-bg)] px-4 py-2.5 shadow-[0_10px_24px_-18px_rgba(0,0,0,.9)]">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label={t("menu")}
          className="press flex h-9 w-9 items-center justify-center rounded-xl border border-hair bg-white/[0.035] text-soft hover:bg-white/[0.08]"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>
        <button type="button" onClick={() => navigate({ name: "home" })} className="press flex items-center gap-2">
          <LogoMark size={30} />
          <span className="font-display text-[18px] font-extrabold tracking-tight">
            <span className="text-app">AI </span>
            <span className="neon-text">HUB</span>
          </span>
        </button>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => navigate({ name: "notifications" })}
            aria-label={t("notificationsTitle")}
            className="press relative flex h-9 w-9 items-center justify-center rounded-xl border border-hair bg-white/[0.035] text-soft hover:bg-white/[0.08]"
          >
            <Bell className="h-[17px] w-[17px]" />
            {notifications && (
              <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-fuchsia-400 ring-2 ring-[var(--app-bg)]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate({ name: "settings" })}
            aria-label={t("profile")}
            className="press flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-violet-400/30 bg-[linear-gradient(145deg,#7c3aed,#ec4899)] text-[11px] font-extrabold text-white shadow-[0_4px_14px_-6px_#a855f7]"
          >
            A
          </button>
        </div>
      </div>

      <div className="stagger">
        <div className="px-5 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-semibold text-muted-app">{dateLabel}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-1.5 py-0.5 text-[8px] font-bold text-emerald-300">
                  <ShieldCheck className="h-2.5 w-2.5" /> {t("local")}
                </span>
              </div>
              <h1 className="mt-1.5 font-display text-[24px] leading-tight font-extrabold tracking-tight text-app">
                {t(greetingKey())},{" "}
                <span className="neon-text">{t("explorer")}</span>
              </h1>
            </div>
            <div className="mt-2 flex shrink-0 items-center justify-center">
              <Sparkles className="h-5 w-5 text-violet-300/80" />
            </div>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-app">{t("welcomeSub")}</p>
        </div>

        {/* search */}
        <div className="px-5 pt-4">
          <div
            className={`flex items-center gap-2.5 rounded-2xl border bg-[var(--surface)] px-3.5 py-2.5 transition ${
              searchFocus ? "border-violet-400/60 shadow-[0_0_0_3px_rgba(139,92,246,.14)]" : "border-hair"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-violet-300" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent text-[12px] text-app outline-none placeholder:text-[var(--muted)]"
            />
            <button
              type="button"
              onClick={submitSearch}
              aria-label={t("search")}
              className="press flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300 hover:bg-violet-500/25"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* arena spotlight */}
        <div className="px-5 pt-4">
          <button
            type="button"
            onClick={() => launch("https://arena.ai/")}
            className="press relative w-full overflow-hidden rounded-2xl border border-violet-300/20 bg-[linear-gradient(115deg,#1a1040_0%,#2a1355_40%,#43144f_72%,#5b1750_100%)] p-4 text-left shadow-[0_20px_40px_-24px_rgba(139,92,246,.9)]"
          >
            <div className="absolute -top-10 -right-8 h-32 w-32 rounded-full bg-fuchsia-500/25 blur-2xl" />
            <div className="absolute -right-2 -bottom-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />
            <div className="absolute top-1/2 right-2 h-24 w-24 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute top-1/2 right-5 h-16 w-16 -translate-y-1/2 rounded-full border border-dashed border-white/15" />
            <div className="relative flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[8px] font-bold tracking-[0.14em] text-violet-100 uppercase">
                  <span className="h-1 w-1 rounded-full bg-amber-300" /> {t("arenaSpotlight")}
                </span>
                <h2 className="mt-1.5 font-display text-[16px] leading-tight font-extrabold text-white">
                  {t("arenaSpotlightTitle")}
                </h2>
                <p className="mt-1 line-clamp-2 pr-2 text-[9.5px] leading-relaxed text-violet-200/80">
                  {t("arenaSpotlightBody")}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[9.5px] font-extrabold text-[#2a1355]">
                  arena.ai <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
              <div className="relative flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur">
                <BrandIcon icon="arena" size={44} bare />
              </div>
            </div>
          </button>
        </div>

        {/* service sections */}
        {homeSections.map((section, sectionIndex) => (
          <section key={section.id} className="pt-5" aria-label={t(section.titleKey as never)}>
            <SectionHead
              title={t(section.titleKey as never)}
              icon={section.icon === "utilities" ? "search" : section.icon === "create" ? "image" : section.id === "social" ? "meta" : "gemini"}
              accent={section.accent}
              count={section.services.length}
              onViewAll={() => {
                if (section.id === "social") navigate({ name: "social" });
                else if (section.id === "chat") navigate({ name: "chat" });
                else if (section.id === "creation") navigate({ name: "create" });
                else navigate({ name: "smart" });
              }}
            />
            <div className="scroll-hide flex gap-2 overflow-x-auto px-5 pb-1">
              {section.services.map((service) => (
                <ServiceTile
                  key={service.id}
                  icon={service.icon}
                  name={
                    service.id === "image"
                      ? t("imageTool").replace("AI ", "").replace(" Generator", "")
                      : service.id === "video"
                        ? t("videoTool").replace("AI ", "").replace(" Generator", "")
                        : service.id === "music"
                          ? t("musicTool").replace("AI ", "").replace(" Generator", "")
                          : service.id === "voice"
                            ? t("voiceTool").replace("AI ", "").replace(" Creator", "")
                            : service.name
                  }
                  sub={service.sub}
                  badge={service.badge}
                  badgeLabel={service.action === "login" ? t("login") : service.action === "create" ? t("create") : t("open")}
                  accent={service.tint}
                  onClick={() => openService(service)}
                />
              ))}
              {sectionIndex === 0 && (
                <button
                  type="button"
                  onClick={() => navigate({ name: "social" })}
                  className="press flex w-[70px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-hair px-1.5 py-3 text-center"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-muted-app">
                    <LayoutGrid className="h-4 w-4" />
                  </span>
                  <span className="text-[9.5px] font-bold text-muted-app">{t("viewAll")}</span>
                </button>
              )}
            </div>
          </section>
        ))}

        {/* bookmark folders */}
        <section className="pt-5">
          <SectionHead
            title={t("myBookmarks")}
            icon="bookmarks"
            accent="#fbbf24"
            onViewAll={() => navigate({ name: "bookmarks" })}
            count={bookmarks.length}
          />
          <div className="scroll-hide flex gap-2.5 overflow-x-auto px-5 pb-1">
            {bmCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate({ name: "bookmarks", category: cat.id })}
                className="press flex w-[70px] shrink-0 flex-col items-center gap-1.5"
              >
                <span className="relative flex h-[52px] w-[62px] items-center justify-center">
                  <Folder
                    className="absolute inset-0 h-full w-full drop-shadow-[0_8px_14px_rgba(0,0,0,.45)]"
                    style={{ color: cat.color, fill: cat.color }}
                    strokeWidth={1.2}
                  />
                  <span className="relative mt-1 text-[10px] font-extrabold text-[#1b1230]">
                    {folderCounts[cat.id] ?? 0}
                  </span>
                </span>
                <span className="line-clamp-2 text-center text-[9px] leading-tight font-bold text-soft">
                  {lang === "kn" ? cat.kn : cat.en}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* security footer */}
        <div className="px-5 pt-5 pb-4">
          <div className="rounded-2xl border border-hair bg-white/[0.025] p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <Lock className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-[10.5px] font-extrabold text-app">{t("privacyFirst")}</p>
                <p className="text-[8.5px] font-medium text-muted-app">
                  {lang === "kn" ? "ಲಾಗಿನ್ ವಿವರಗಳು ನಿಮ್ಮಲ್ಲೇ" : "Your logins stay with each provider"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate({ name: "privacy" })}
                className="press ml-auto rounded-full border border-hair px-2 py-1 text-[8.5px] font-bold text-muted-app hover:text-soft"
              >
                {t("privacyPolicy")}
              </button>
            </div>
            <p className="mt-2.5 text-[9px] leading-relaxed text-muted-app">{t("privacyShort")}</p>
          </div>
          <p className="mt-4 text-center text-[8.5px] font-semibold tracking-wide text-muted-app">
            AI HUB · v1.0.0 · {lang === "kn" ? "ಭಾರತದಲ್ಲಿ ಪ್ರೀತಿಯಿಂದ" : "Made with care in India"}
          </p>
        </div>
      </div>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title={t("workspace")}>
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-hair bg-white/[0.025] p-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(145deg,#7c3aed,#ec4899)] font-display text-[15px] font-extrabold text-white">
            A
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[13px] font-bold text-app">{t("guest")}</p>
            <p className="mt-0.5 truncate text-[9.5px] text-muted-app">{t("guestSub")}</p>
          </div>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[8px] font-bold text-emerald-300">
            {t("secure")}
          </span>
        </div>
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setLang(lang === "en" ? "kn" : "en");
            }}
            className="press flex items-center gap-2 rounded-xl border border-hair bg-white/[0.035] p-2.5 text-left"
          >
            <Languages className="h-4 w-4 text-violet-300" />
            <span className="text-[10.5px] font-bold text-app">{lang === "en" ? "ಕನ್ನಡ" : "English"}</span>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="press flex items-center gap-2 rounded-xl border border-hair bg-white/[0.035] p-2.5 text-left"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-violet-300" />}
            <span className="text-[10.5px] font-bold text-app">{theme === "dark" ? t("light") : t("dark")}</span>
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-hair">
          <MenuRow icon={<LayoutGrid className="h-4 w-4" />} title={t("explore")} onClick={() => { setMenuOpen(false); navigate({ name: "explore" }); }} />
          <MenuRow icon={<Bookmark className="h-4 w-4" />} title={t("bookmarks")} subtitle={`${bookmarks.length} ${t("bookmarkCount")}`} onClick={() => { setMenuOpen(false); navigate({ name: "bookmarks" }); }} />
          <MenuRow icon={<Sparkles className="h-4 w-4" />} title={t("arenaTitle")} subtitle="arena.ai" onClick={() => { setMenuOpen(false); launch("https://arena.ai/"); }} />
          <MenuRow icon={<SettingsIcon className="h-4 w-4" />} title={t("settingsTitle")} onClick={() => { setMenuOpen(false); navigate({ name: "settings" }); }} />
          <MenuRow icon={<Info className="h-4 w-4" />} title={t("aboutApp")} onClick={() => { setMenuOpen(false); navigate({ name: "about" }); }} last />
        </div>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[8.5px] font-semibold text-muted-app">
          <ShieldCheck className="h-3 w-3" /> {t("noPassword")}
        </p>
      </Sheet>
    </div>
  );
}


