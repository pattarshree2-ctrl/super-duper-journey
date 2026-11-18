import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BatteryFull,
  Bookmark,
  BookmarkPlus,
  Check,
  Clapperboard,
  Compass,
  FolderUp,
  Home as HomeIcon,
  Image as ImageIcon,
  Info,
  KeyRound,
  Lock,
  Mic,
  Music2,
  Plus,
  QrCode,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  Signal,
  Sparkles,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { AppProvider, useApp } from "./store";
import HomeScreen from "./screens/Home";
import { ArenaScreen, ChatScreen, CreateScreen, ExploreScreen, SmartScreen, SocialScreen } from "./screens/Services";
import { GmailScreen, ImageStudio, MusicStudio, VideoStudio, VoiceStudio } from "./screens/Studios";
import { FileTransferScreen, QrGeneratorScreen, QrScannerScreen, SearchScreen } from "./screens/Tools";
import BookmarksScreen from "./screens/Bookmarks";
import { ApiKeysScreen, SettingsScreen } from "./screens/Settings";
import { AboutScreen, NotificationsScreen, PrivacyScreen } from "./screens/Extras";
import { LogoLockup, LogoMark } from "./components/Brand";
import { Btn, Sheet } from "./components/ui";
import { formatTime } from "./utils/media";

/* -------------------------------- status bar ------------------------------- */

function StatusBar() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 20000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="hidden shrink-0 items-center justify-between px-6 pt-2.5 pb-1 lg:flex">
      <span className="w-16 font-display text-[11px] font-bold tracking-wide text-app">{formatTime(now)}</span>
      <span className="h-[22px] w-[86px] rounded-full bg-black/90 ring-1 ring-white/[0.06]" />
      <span className="flex w-16 items-center justify-end gap-1 text-app">
        <Signal className="h-3 w-3" strokeWidth={2.5} />
        <Wifi className="h-3 w-3" strokeWidth={2.5} />
        <BatteryFull className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
    </div>
  );
}

/* ---------------------------------- toasts --------------------------------- */

function Toasts() {
  const { toasts, dismissToast } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none absolute inset-x-3 bottom-[calc(80px+env(safe-area-inset-bottom))] z-[70] flex flex-col items-center gap-1.5">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismissToast(toast.id)}
          className={`screen-in pointer-events-auto flex w-full max-w-[340px] items-center gap-2 rounded-xl border px-3 py-2.5 text-left shadow-[0_16px_40px_-16px_rgba(0,0,0,.8)] backdrop-blur-xl ${
            toast.kind === "error"
              ? "border-rose-400/25 bg-[#2a0f1c]/95 text-rose-100"
              : toast.kind === "info"
                ? "border-sky-400/25 bg-[#0d1b2e]/95 text-sky-100"
                : "border-emerald-400/25 bg-[#0a1f1b]/95 text-emerald-100"
          }`}
        >
          {toast.kind === "error" ? (
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          ) : toast.kind === "info" ? (
            <Info className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <Check className="h-3.5 w-3.5 shrink-0" />
          )}
          <span className="flex-1 text-[10px] leading-snug font-semibold">{toast.message}</span>
          <X className="h-3 w-3 shrink-0 opacity-50" />
        </button>
      ))}
    </div>
  );
}

/* -------------------------------- quick create ------------------------------ */

const quickActions = [
  { id: "image", label: "Image", sub: "Generate art", icon: ImageIcon, accent: "#f472b6" },
  { id: "video", label: "Video", sub: "Plan a shot", icon: Clapperboard, accent: "#818cf8" },
  { id: "music", label: "Music", sub: "Build a song", icon: Music2, accent: "#fbbf24" },
  { id: "voice", label: "Voice", sub: "Speak a script", icon: Mic, accent: "#34d399" },
  { id: "qrgen", label: "QR code", sub: "Create & share", icon: QrCode, accent: "#a78bfa" },
  { id: "files", label: "Files", sub: "Send & receive", icon: FolderUp, accent: "#f59e0b" },
];

function QuickCreate({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang, navigate } = useApp();
  return (
    <Sheet open={open} onClose={onClose} title={t("quickCreate")}>
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/[0.07] p-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] font-extrabold text-app">{t("whatToday")}</p>
          <p className="mt-0.5 text-[9px] text-muted-app">{t("quickCreateSub")}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {quickActions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => {
              onClose();
              navigate({ name: "tool", tool: action.id });
            }}
            className="press flex flex-col items-start gap-2 rounded-xl border border-hair bg-white/[0.025] p-2.5 text-left hover:border-white/20"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${action.accent}18`, color: action.accent }}>
              <action.icon className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[10px] font-bold text-app">{action.label}</span>
              <span className="mt-0.5 block text-[8px] text-muted-app">{action.sub}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate({ name: "bookmarks" });
          }}
          className="press flex items-center gap-2 rounded-xl border border-hair bg-white/[0.025] p-2.5"
        >
          <BookmarkPlus className="h-4 w-4 text-amber-300" />
          <span className="text-[9.5px] font-bold text-soft">{t("bookmarkThis")}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate({ name: "tool", tool: "search" });
          }}
          className="press flex items-center gap-2 rounded-xl border border-hair bg-white/[0.025] p-2.5"
        >
          <Search className="h-4 w-4 text-emerald-300" />
          <span className="text-[9.5px] font-bold text-soft">{t("searchWeb")}</span>
        </button>
      </div>
      <p className="mt-3 text-center text-[8px] text-muted-app">
        {lang === "kn" ? "ಹೊಸದನ್ನು ರಚಿಸಲು ಸಿದ್ಧ" : "Ready when you are"} · AI HUB
      </p>
    </Sheet>
  );
}

/* -------------------------------- bottom nav ------------------------------- */

function BottomNav({ onQuickCreate }: { onQuickCreate: () => void }) {
  const { t, view, switchTab } = useApp();
  const active =
    view.name === "bookmarks"
      ? "bookmarks"
      : view.name === "explore"
        ? "explore"
        : ["settings", "keys", "privacy", "about", "notifications"].includes(view.name)
          ? "settings"
          : "home";

  const tabs = [
    { id: "home", icon: HomeIcon, label: t("home") },
    { id: "bookmarks", icon: Bookmark, label: t("bookmarks") },
    { id: "quick", icon: Plus, label: t("create") },
    { id: "explore", icon: Compass, label: t("explore") },
    { id: "settings", icon: SettingsIcon, label: t("settings") },
  ] as const;

  return (
    <nav className="relative z-40 shrink-0 border-t border-hair bg-[var(--nav)] px-1.5 pt-2 pb-[max(10px,env(safe-area-inset-bottom))] backdrop-blur-2xl">
      <div className="grid grid-cols-5 items-end">
        {tabs.map((tab) => {
          if (tab.id === "quick") {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={onQuickCreate}
                aria-label={t("quickCreate")}
                className="press relative flex flex-col items-center justify-end gap-0.5"
              >
                <span className="absolute -top-6 flex h-[46px] w-[46px] items-center justify-center rounded-full border-[3px] border-[var(--app-bg)] neon-gradient text-white shadow-[0_10px_24px_-8px_rgba(168,85,247,.9)]">
                  <Plus className="h-5 w-5" strokeWidth={2.6} />
                </span>
                <span className="mt-[22px] text-[8px] font-bold text-muted-app">{tab.label}</span>
              </button>
            );
          }
          const isActive = active === tab.id;
          const target =
            tab.id === "home"
              ? ({ name: "home" } as const)
              : tab.id === "bookmarks"
                ? ({ name: "bookmarks" } as const)
                : tab.id === "explore"
                  ? ({ name: "explore" } as const)
                  : ({ name: "settings" } as const);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchTab(target)}
              aria-current={isActive ? "page" : undefined}
              className="press relative flex flex-col items-center gap-0.5 py-0.5"
            >
              {isActive && (
                <span className="absolute -top-1.5 h-[3px] w-6 rounded-full bg-[linear-gradient(90deg,#8b5cf6,#ec4899)] shadow-[0_0_10px_rgba(168,85,247,.9)]" />
              )}
              <tab.icon className={`h-[17px] w-[17px] transition ${isActive ? "text-violet-300" : "text-muted-app"}`} strokeWidth={isActive ? 2.4 : 1.9} />
              <span className={`text-[8px] font-bold transition ${isActive ? "text-violet-300" : "text-muted-app"}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ---------------------------------- router -------------------------------- */

function Routes() {
  const { view } = useApp();
  if (view.name === "home") return <HomeScreen />;
  if (view.name === "social") return <SocialScreen />;
  if (view.name === "chat") return <ChatScreen />;
  if (view.name === "create") return <CreateScreen />;
  if (view.name === "smart") return <SmartScreen />;
  if (view.name === "arena") return <ArenaScreen />;
  if (view.name === "bookmarks") return <BookmarksScreen />;
  if (view.name === "settings") return <SettingsScreen />;
  if (view.name === "keys") return <ApiKeysScreen />;
  if (view.name === "privacy") return <PrivacyScreen />;
  if (view.name === "about") return <AboutScreen />;
  if (view.name === "notifications") return <NotificationsScreen />;
  if (view.name === "explore") return view.q ? <SearchScreen initialQuery={view.q} /> : <ExploreScreen />;
  if (view.name === "tool") {
    switch (view.tool) {
      case "image":
        return <ImageStudio />;
      case "video":
        return <VideoStudio />;
      case "music":
        return <MusicStudio />;
      case "voice":
        return <VoiceStudio />;
      case "gmail":
        return <GmailScreen />;
      case "qrscan":
        return <QrScannerScreen />;
      case "qrgen":
        return <QrGeneratorScreen />;
      case "files":
        return <FileTransferScreen />;
      case "search":
        return <SearchScreen />;
      case "arena":
        return <ArenaScreen />;
      default:
        return <ExploreScreen />;
    }
  }
  return <HomeScreen />;
}

/* --------------------------------- app shell ------------------------------- */

function AppSurface() {
  const { theme, view, stack } = useApp();
  const [quickOpen, setQuickOpen] = useState(false);
  const scrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [view, stack.length]);

  return (
    <div className="app-shell relative flex h-full w-full flex-col" data-theme={theme}>
      <StatusBar />
      <main ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto scroll-hide overscroll-contain">
        <div key={`${view.name}-${"tool" in view ? view.tool : ""}`} className="screen-in min-h-full">
          <Routes />
        </div>
      </main>
      <Toasts />
      <BottomNav onQuickCreate={() => setQuickOpen(true)} />
      <QuickCreate open={quickOpen} onClose={() => setQuickOpen(false)} />
      <div id="aihub-overlay" className="pointer-events-none absolute inset-0 z-[60]" />
    </div>
  );
}

/* ------------------------------ brand showcase ----------------------------- */

function BrandPanel() {
  const { t, lang, switchTab, setLang } = useApp();
  return (
    <aside className="relative hidden w-[340px] shrink-0 flex-col justify-center lg:flex xl:w-[386px]">
      <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="text-[9px] font-bold tracking-[0.16em] text-white/65 uppercase">Android workspace · {lang === "kn" ? "ಕನ್ನಡ + English" : "Kannada + English"}</span>
      </div>

      <div className="relative">
        <div className="absolute -top-16 -left-14 h-48 w-48 rounded-full bg-violet-600/25 blur-[70px]" />
        <div className="relative flex items-center gap-3">
          <LogoMark size={96} />
          <div className="leading-none">
            <h1 className="font-display text-[62px] font-extrabold tracking-[-0.05em] text-white xl:text-[72px]">
              AI <span className="neon-text">HUB</span>
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-[2px] w-10 rounded-full bg-[linear-gradient(90deg,#22d3ee,#a855f7)]" />
              <span className="h-[2px] w-5 rounded-full bg-[linear-gradient(90deg,#f472b6,#fbbf24)]" />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 font-display text-[24px] leading-tight font-semibold tracking-tight text-white/90 xl:text-[28px]">
        Your All-in-One
        <br />
        AI Workspace
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-[14px] font-semibold italic">
        <span className="bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">Explore</span>
        <span className="text-white/25">•</span>
        <span className="bg-gradient-to-r from-cyan-200 to-sky-400 bg-clip-text text-transparent">Create</span>
        <span className="text-white/25">•</span>
        <span className="bg-gradient-to-r from-fuchsia-300 to-violet-400 bg-clip-text text-transparent">Innovate</span>
      </div>

      <p className="mt-4 max-w-[330px] text-[12px] leading-relaxed text-white/50">
        {t("allYourTools")} {lang === "kn" ? "chat, create, scan, share — all in one beautiful place." : "Chat, create, scan, share — all in one beautiful place."}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {[
          { value: "13", label: "AI tools", accent: "#c4b5fd" },
          { value: "05", label: "Assistants", accent: "#7dd3fc" },
          { value: "07", label: "Key slots", accent: "#fcd34d" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 backdrop-blur">
            <p className="font-display text-[19px] leading-none font-extrabold" style={{ color: stat.accent }}>
              {stat.value}
            </p>
            <p className="mt-1 text-[8.5px] font-semibold tracking-wide text-white/40 uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur">
        {[
          "All AI tools in one place",
          "Smart search across the web",
          "Official sign-in, no stored passwords",
          "Bookmark & organise anything",
          "Create with AI, every day",
        ].map((line) => (
          <div key={line} className="flex items-center gap-2.5 py-[5px]">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
              <Check className="h-2.5 w-2.5 text-emerald-300" strokeWidth={3} />
            </span>
            <span className="text-[11px] font-medium text-white/65">{line}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => switchTab({ name: "explore" })}
          className="press inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(110deg,#7c3aed,#a855f7_55%,#ec4899)] px-4 py-2.5 text-[11px] font-bold text-white shadow-[0_14px_34px_-14px_rgba(168,85,247,.95)]"
        >
          Explore the workspace <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setLang(lang === "en" ? "kn" : "en")}
          className="press rounded-xl border border-white/15 bg-white/[0.045] px-3 py-2.5 text-[11px] font-bold text-white/70"
        >
          {lang === "en" ? "ಕನ್ನಡ" : "English"}
        </button>
      </div>
    </aside>
  );
}

function FeaturePanel() {
  const { switchTab } = useApp();
  const features = [
    { icon: <Search className="h-5 w-5" />, title: "One Search", body: "Multiple platforms", accent: "#7c3aed", onClick: () => switchTab({ name: "tool", tool: "search" }) },
    { icon: <ShieldCheck className="h-5 w-5" />, title: "Official Sign-In", body: "Secure, local access", accent: "#10b981", onClick: () => switchTab({ name: "privacy" }) },
    { icon: <Bookmark className="h-5 w-5" />, title: "Organize Your", body: "Bookmarks", accent: "#f59e0b", onClick: () => switchTab({ name: "bookmarks" }) },
    { icon: <Sparkles className="h-5 w-5" />, title: "Create Stunning", body: "Images, videos & songs", accent: "#38bdf8", onClick: () => switchTab({ name: "create" }) },
    { icon: <Zap className="h-5 w-5" />, title: "Boost Your", body: "Productivity", accent: "#facc15", onClick: () => switchTab({ name: "explore" }) },
  ];
  return (
    <aside className="hidden w-[292px] shrink-0 flex-col justify-center 2xl:w-[312px] xl:flex">
      <div className="space-y-2.5">
        {features.map((feature) => (
          <button
            key={feature.title}
            type="button"
            onClick={feature.onClick}
            className="press group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left backdrop-blur transition hover:border-violet-300/30 hover:bg-white/[0.065]"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.2)]"
              style={{ background: `linear-gradient(145deg, ${feature.accent}, ${feature.accent}88)` }}
            >
              {feature.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[13px] leading-tight font-bold text-white">{feature.title}</span>
              <span className="mt-0.5 block text-[11px] leading-tight text-white/45">{feature.body}</span>
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-violet-300" />
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur">
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-emerald-300" />
          <span className="text-[9px] font-bold tracking-[0.14em] text-white/60 uppercase">Privacy first</span>
        </div>
        <p className="mt-1.5 text-[10px] leading-relaxed text-white/40">
          No stored passwords. Your keys, bookmarks and files stay on your device.
        </p>
      </div>

      <div className="mt-6 text-right">
        <p className="font-display text-[22px] leading-tight font-semibold italic">
          <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">Smarter Tools…</span>
          <br />
          <span className="bg-gradient-to-r from-yellow-100 via-amber-200 to-yellow-400 bg-clip-text text-transparent">A Smarter You…</span>
        </p>
        <svg viewBox="0 0 160 8" className="ml-auto mt-1 h-2 w-28 text-amber-300">
          <path d="M2 5c28-4 60-4 84-1 22 3 46 3 72-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 text-[9px] font-semibold text-white/30">
        <KeyRound className="h-3 w-3" /> AI HUB · v1.0.0
      </div>
    </aside>
  );
}

function Workspace() {
  return (
    <div className="showcase-bg relative flex min-h-[100dvh] w-full items-center justify-center">
      <div className="showcase-grid pointer-events-none fixed inset-0" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 hidden h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-violet-400/10 xl:block" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 hidden h-[680px] w-[680px] -translate-x-1/2 rounded-full border border-white/[0.04] xl:block" />
      <div className="relative z-10 flex w-full max-w-[1560px] items-center justify-center gap-8 px-0 py-0 lg:gap-10 lg:px-6 lg:py-5 xl:gap-12 2xl:gap-16">
        <BrandPanel />
        <div className="phone-rim">
          <div className="phone-shell">
            <AppSurface />
          </div>
        </div>
        <FeaturePanel />
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur lg:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="text-[8.5px] font-bold tracking-[0.16em] text-white/35 uppercase">Live workspace · runs in your browser</span>
        <span className="text-[8.5px] text-white/20">|</span>
        <span className="flex items-center gap-1 text-[8.5px] font-bold text-white/35">
          <ShieldCheck className="h-2.5 w-2.5" /> Local-first demo
        </span>
      </div>

      <div className="pointer-events-none absolute top-5 left-6 z-10 hidden items-center gap-2 xl:flex">
        <LogoLockup compact />
      </div>
      <div className="pointer-events-none absolute top-5 right-6 z-10 hidden xl:block">
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[8.5px] font-bold tracking-[0.16em] text-white/40 uppercase">Explore · Create · Innovate</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Workspace />
    </AppProvider>
  );
}

export { Btn, HomeIcon, Compass };
