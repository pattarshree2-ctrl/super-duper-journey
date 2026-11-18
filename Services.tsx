import { ArrowUpRight, Camera, Check, ExternalLink, Image as ImageIcon, KeyRound, Lock, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { useApp } from "../store";
import { BrandIcon, LogoMark } from "../components/Brand";
import { Btn, KeyPill, Notice, ScreenHeader } from "../components/ui";
import { ARENA_URL, chatServices, homeSections, type Service } from "../data";
import { useServiceLaunch } from "./Home";

function ServiceRow({ service, onOpen }: { service: Service; onOpen: () => void }) {
  const { keys, t, lang } = useApp();
  const configured = service.apiKey ? Boolean(keys[service.apiKey]) : false;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="press flex w-full items-center gap-3 rounded-2xl border border-hair bg-[var(--surface)] p-3 text-left shadow-[0_8px_24px_-20px_rgba(0,0,0,.8)] hover:border-white/20"
    >
      <BrandIcon icon={service.icon} size={42} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-[12px] font-extrabold text-app">{service.name}</p>
          {service.badge === "independent" && (
            <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-1.5 py-[1px] text-[7.5px] font-extrabold text-amber-300">
              {t("external")}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[9.5px] text-muted-app">{service.sub}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          {service.apiKey ? (
            <KeyPill configured={configured} label={configured ? t("apiReady") : t("noKey")} />
          ) : (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[8px] font-bold text-muted-app">
              {service.badge === "independent" ? (lang === "kn" ? "ಸ್ವತಂತ್ರ" : "Independent") : t("official")}
            </span>
          )}
        </div>
      </div>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/10 text-violet-300">
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

export function SocialScreen() {
  const { t, launch, lang } = useApp();
  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("socialTitle")} subtitle={t("socialSub")} accent="#25d366" />
      <div className="px-5">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-300/20 bg-[linear-gradient(120deg,#071f1a,#0d2a3d_55%,#231345)] p-4">
          <div className="absolute -top-8 -right-4 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[13px] font-extrabold text-white">
                {t("officialSite")}
              </p>
              <p className="mt-0.5 text-[9.5px] leading-relaxed text-white/70">{t("openInNewTab")}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {homeSections[0].services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => launch(service.url)}
              className="press group flex flex-col items-start gap-2.5 rounded-2xl border border-hair bg-[var(--surface)] p-3 text-left shadow-[0_10px_30px_-22px_rgba(0,0,0,.9)] hover:border-white/20"
            >
              <div className="flex w-full items-start justify-between">
                <BrandIcon icon={service.icon} size={40} />
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-app transition group-hover:text-violet-300" />
              </div>
              <div>
                <p className="text-[12px] font-extrabold text-app">{service.name}</p>
                <p className="mt-0.5 text-[9px] text-muted-app">{service.sub}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[8px] font-bold text-emerald-300">
                <span className="h-1 w-1 rounded-full bg-emerald-400" /> {t("webLogin")}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <Notice icon={<Lock className="h-4 w-4" />} tone="green">
            {t("socialNote")}
          </Notice>
        </div>

        <div className="mt-4 space-y-2 rounded-2xl border border-hair bg-white/[0.02] p-3.5">
          {[
            lang === "kn" ? "ನಿಮ್ಮ ಲಾಗಿನ್ ವಿವರಗಳನ್ನು AI HUB ಎಂದಿಗೂ ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ." : "AI HUB never stores your social login details.",
            t("newTab"),
            t("noPassword"),
          ].map((line) => (
            <div key={line} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                <Check className="h-2.5 w-2.5" />
              </span>
              <p className="text-[10px] leading-relaxed text-muted-app">{line}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChatScreen() {
  const { t, launch, keys, navigate } = useApp();
  const regular = chatServices.filter((s) => s.id !== "arena");
  const arena = chatServices.find((s) => s.id === "arena")!;
  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("chatTitle")} subtitle={t("chatSub")} accent="#38bdf8" />
      <div className="space-y-2 px-5">
        <div className="mb-3 flex items-center justify-between rounded-xl border border-hair bg-white/[0.025] px-3 py-2">
          <span className="flex items-center gap-1.5 text-[9.5px] font-bold text-muted-app">
            <KeyRound className="h-3 w-3 text-emerald-400" />
            {Object.values(keys).filter(Boolean).length}/5 {t("configured")}
          </span>
          <button
            type="button"
            onClick={() => navigate({ name: "keys" })}
            className="text-[9.5px] font-bold text-violet-300 hover:text-violet-200"
          >
            {t("apiKeys")}
          </button>
        </div>
        {regular.map((service) => (
          <ServiceRow key={service.id} service={service} onOpen={() => launch(service.url)} />
        ))}
      </div>

      <div className="px-5 pt-4">
        <div className="relative overflow-hidden rounded-2xl border border-violet-300/20 bg-[linear-gradient(130deg,#1c1038,#2c1356_52%,#48154d)] p-4">
          <div className="absolute -top-8 -right-6 h-28 w-28 rounded-full bg-violet-500/25 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <BrandIcon icon="arena" size={42} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-extrabold text-white">{arena.name}</p>
                  <span className="rounded-full border border-white/20 bg-white/10 px-1.5 py-0.5 text-[7px] font-extrabold tracking-wide text-white/90 uppercase">
                    {t("arenaSpotlight")}
                  </span>
                </div>
                <p className="mt-0.5 text-[9px] text-violet-200/80">arena.ai · {t("arenaSub")}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Btn size="sm" onClick={() => launch(ARENA_URL)} className="flex-1">
                {t("arenaOpen")} <ExternalLink className="h-3 w-3" />
              </Btn>
              <Btn size="sm" variant="outline" onClick={() => navigate({ name: "arena" })} className="border-white/20 bg-white/10 text-white">
                {t("more")}
              </Btn>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <Notice icon={<ShieldCheck className="h-4 w-4" />}>{t("chatNote")}</Notice>
      </div>
    </div>
  );
}

export function CreateScreen() {
  const { t, launch } = useApp();
  const openService = useServiceLaunch();
  const creation = homeSections.find((s) => s.id === "creation")!.services;
  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("aiCreation")} subtitle={t("promptStudio") + " · " + t("moreTools")} accent="#f472b6" />
      <div className="px-5">
        <div className="relative overflow-hidden rounded-2xl border border-pink-300/20 bg-[linear-gradient(120deg,#2b1030,#3a123f_50%,#151a44)] p-4">
          <div className="absolute -top-8 right-2 h-24 w-24 rounded-full bg-fuchsia-500/25 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-pink-200">
              <Wand2 className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-[13px] font-extrabold text-white">{t("whatToday")}</p>
              <p className="mt-0.5 text-[9.5px] text-white/65">{t("quickCreateSub")}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {creation.map((service, index) => (
            <button
              key={service.id}
              type="button"
              onClick={() => openService(service)}
              className={`press relative overflow-hidden rounded-2xl border border-hair bg-[var(--surface)] p-3 text-left hover:border-white/20 ${index === 4 ? "col-span-2" : ""}`}
            >
              <div className="flex items-center justify-between">
                <BrandIcon icon={service.icon} size={40} />
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-app" />
              </div>
              <p className="mt-2 text-[12px] font-extrabold text-app">
                {service.id === "image"
                  ? t("imageTool")
                  : service.id === "video"
                    ? t("videoTool")
                    : service.id === "music"
                      ? t("musicTool")
                      : service.id === "voice"
                        ? t("voiceTool")
                        : t("gmailTool")}
              </p>
              <p className="mt-0.5 text-[9px] text-muted-app">{service.sub}</p>
            </button>
          ))}
        </div>

        <div className="mt-5">
          <p className="mb-2 font-display text-[12px] font-bold text-app">{t("moreTools")}</p>
          <div className="space-y-2">
            {[
              { name: "Gemini image", note: "Google's assistant", url: "https://gemini.google.com/app" },
              { name: "Suno", note: "Songs from prompts", url: "https://suno.com/" },
              { name: "Runway", note: "Gen video suite", url: "https://runwayml.com/" },
            ].map((tool) => (
              <button
                key={tool.name}
                type="button"
                onClick={() => launch(tool.url)}
                className="press flex w-full items-center gap-2.5 rounded-xl border border-hair bg-white/[0.02] px-3 py-2.5 text-left"
              >
                <ImageIcon className="h-4 w-4 text-pink-300" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10.5px] font-bold text-app">{tool.name}</p>
                  <p className="text-[8.5px] text-muted-app">{tool.note}</p>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-app" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SmartScreen() {
  const { t, navigate, launch, keys } = useApp();
  const utilities = homeSections.find((s) => s.id === "utilities")!.services;
  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("smartTools")} subtitle={t("privacyFirst")} accent="#fbbf24" />
      <div className="px-5">
        <div className="relative overflow-hidden rounded-2xl border border-sky-300/20 bg-[linear-gradient(120deg,#0a2030,#102a44_55%,#211347)] p-4">
          <div className="absolute -right-4 -bottom-8 h-24 w-24 rounded-full bg-sky-400/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-sky-200">
              <Camera className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-[13px] font-extrabold text-white">{t("noKey")} · {t("privacyFirst")}</p>
              <p className="mt-0.5 text-[9.5px] text-white/65">{t("permissionsInfo")}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {utilities.map((service) => (
            <ServiceRow key={service.id} service={service} onOpen={() => (service.url.startsWith("#tool") ? navigate({ name: "tool", tool: service.url.replace("#tool/", "") }) : navigate({ name: "bookmarks" }))} />
          ))}
        </div>
        <div className="mt-4">
          <Notice icon={<Sparkles className="h-4 w-4" />}>{t("unlockMoreBody")}</Notice>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => navigate({ name: "keys" })}
            className="press rounded-xl border border-hair bg-white/[0.03] p-3 text-left"
          >
            <KeyRound className="h-4 w-4 text-violet-300" />
            <p className="mt-2 text-[10.5px] font-bold text-app">{t("apiKeys")}</p>
            <p className="mt-0.5 text-[8.5px] text-muted-app">
              {Object.values(keys).filter(Boolean).length} {t("configured")}
            </p>
          </button>
          <button
            type="button"
            onClick={() => launch("https://arena.ai/")}
            className="press rounded-xl border border-hair bg-white/[0.03] p-3 text-left"
          >
            <BrandIcon icon="arena" size={22} bare />
            <p className="mt-2 text-[10.5px] font-bold text-app">{t("arenaTitle")}</p>
            <p className="mt-0.5 text-[8.5px] text-muted-app">arena.ai</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ArenaScreen() {
  const { t, launch, navigate, lang } = useApp();
  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("arenaTitle")} subtitle={t("arenaSub")} accent="#a855f7" />
      <div className="px-5">
        <div className="relative overflow-hidden rounded-3xl border border-violet-300/20 bg-[linear-gradient(140deg,#1a0e35,#2b1256_45%,#4a154d_80%,#2b1039)] p-5 text-center">
          <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/15 bg-white/[0.08] backdrop-blur">
            <BrandIcon icon="arena" size={62} bare />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/25 bg-amber-300/10 px-2 py-0.5 text-[8px] font-extrabold tracking-[0.14em] text-amber-200 uppercase">
            {t("arenaSpotlight")}
          </span>
          <h2 className="mt-2 font-display text-[22px] font-extrabold text-white">Arena AI</h2>
          <p className="mx-auto mt-1 max-w-[260px] text-[10.5px] leading-relaxed text-violet-100/75">{t("arenaSpotlightBody")}</p>
          <Btn size="lg" className="mt-4" onClick={() => launch(ARENA_URL)}>
            {t("arenaOpen")} <ExternalLink className="h-3.5 w-3.5" />
          </Btn>
          <p className="mt-2 font-mono text-[9px] tracking-wide text-white/45">https://arena.ai/</p>
        </div>

        <div className="mt-4 space-y-2">
          {[
            { icon: <Lock className="h-4 w-4" />, title: t("noPassword"), body: t("arenaNote") },
            {
              icon: <ExternalLink className="h-4 w-4" />,
              title: t("external"),
              body: t("openInNewTab"),
            },
            {
              icon: <ShieldCheck className="h-4 w-4" />,
              title: t("officialSite"),
              body:
                lang === "kn"
                  ? "ಲಾಗಿನ್ ಮತ್ತು ಸೈನ್ ಅಪ್ ಸಂಪೂರ್ಣವಾಗಿ arena.ai ನಲ್ಲಿಯೇ ನಡೆಯುತ್ತದೆ."
                  : "Login and Sign Up are handled entirely on arena.ai.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 rounded-2xl border border-hair bg-white/[0.02] p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/10 text-violet-300">
                {item.icon}
              </span>
              <div>
                <p className="text-[10.5px] font-extrabold text-app">{item.title}</p>
                <p className="mt-0.5 text-[9.5px] leading-relaxed text-muted-app">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Btn variant="outline" onClick={() => navigate({ name: "keys" })}>
            <KeyRound className="h-3.5 w-3.5" /> {t("apiKeys")}
          </Btn>
          <Btn variant="outline" onClick={() => navigate({ name: "privacy" })}>
            <ShieldCheck className="h-3.5 w-3.5" /> {t("privacyPolicy")}
          </Btn>
        </div>
        <p className="mt-3 text-center text-[8.5px] leading-relaxed text-muted-app">{t("aboutIndependent")}</p>
        <div className="mt-4 flex items-center justify-center gap-2 opacity-70">
          <LogoMark size={22} />
          <span className="text-[8.5px] font-bold text-muted-app">AI HUB · independent launcher</span>
        </div>
      </div>
    </div>
  );
}

export function ExploreScreen() {
  const { navigate, launch, t, lang, bookmarks } = useApp();
  const bookmarkTotal = bookmarks.length;
  const categories: ("All" | "AI Chat" | "AI Creation" | "Social" | "Utilities")[] = [
    "All",
    "AI Chat",
    "AI Creation",
    "Social",
    "Utilities",
  ];
  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("explore")} subtitle={t("allYourTools")} accent="#22d3ee" />
      <div className="px-5">
        <button
          type="button"
          onClick={() => navigate({ name: "tool", tool: "search" })}
          className="press mb-4 flex w-full items-center gap-2.5 rounded-2xl border border-hair bg-[var(--surface)] px-3.5 py-3 text-left"
        >
          <Sparkles className="h-4 w-4 text-violet-300" />
          <span className="flex-1 text-[11px] font-semibold text-muted-app">{t("searchPlaceholder")}</span>
          <kbd className="rounded-md border border-hair bg-white/[0.04] px-1.5 py-0.5 text-[8px] font-bold text-muted-app">⌘ K</kbd>
        </button>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                navigate(
                  cat === "All"
                    ? { name: "explore" }
                    : cat === "Social"
                      ? { name: "social" }
                      : cat === "AI Chat"
                        ? { name: "chat" }
                        : cat === "AI Creation"
                          ? { name: "create" }
                          : { name: "smart" },
                )
              }
              className="press rounded-full border border-hair bg-white/[0.03] px-3 py-1.5 text-[9.5px] font-bold text-soft"
            >
              {cat === "All" ? t("all") : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { name: t("socialTitle"), sub: "4 links", icon: "meta" as const, go: { name: "social" as const } },
            { name: t("chatTitle"), sub: "5 assistants", icon: "gemini" as const, go: { name: "chat" as const } },
            { name: t("imageTool"), sub: "Prompt studio", icon: "image" as const, go: { name: "tool" as const, tool: "image" } },
            { name: t("videoTool"), sub: "Shot planner", icon: "video" as const, go: { name: "tool" as const, tool: "video" } },
            { name: t("musicTool"), sub: "Song brief", icon: "music" as const, go: { name: "tool" as const, tool: "music" } },
            { name: t("voiceTool"), sub: "Voice preview", icon: "voice" as const, go: { name: "tool" as const, tool: "voice" } },
            { name: t("qrScanner"), sub: t("enableCamera"), icon: "qrscan" as const, go: { name: "tool" as const, tool: "qrscan" } },
            { name: t("qrGenerator"), sub: t("livePreview"), icon: "qrgen" as const, go: { name: "tool" as const, tool: "qrgen" } },
            { name: t("fileTransfer"), sub: t("send") + " · " + t("receive"), icon: "files" as const, go: { name: "tool" as const, tool: "files" } },
            { name: t("websiteSearch"), sub: "Google", icon: "search" as const, go: { name: "tool" as const, tool: "search" } },
            { name: t("bookmarks"), sub: t("bookmarkCount"), icon: "bookmarks" as const, go: { name: "bookmarks" as const } },
            { name: t("arenaTitle"), sub: "arena.ai", icon: "arena" as const, go: { name: "arena" as const } },
          ].map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => navigate(item.go)}
              className="press flex flex-col gap-2 rounded-2xl border border-hair bg-[var(--surface)] p-3 text-left hover:border-white/20"
            >
              <BrandIcon icon={item.icon} size={36} />
              <div>
                <p className="line-clamp-2 text-[10.5px] leading-tight font-extrabold text-app">{item.name}</p>
                <p className="mt-1 text-[8.5px] text-muted-app">{item.sub}</p>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => launch("https://arena.ai/")}
          className="press mt-4 flex w-full items-center gap-3 rounded-2xl border border-violet-400/25 bg-[linear-gradient(120deg,#1a1038,#32144f)] p-3.5 text-left"
        >
          <BrandIcon icon="arena" size={40} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold text-white">{t("arenaSpotlightTitle")}</p>
            <p className="mt-0.5 text-[9px] text-violet-200/70">
              {lang === "kn" ? "ಸ್ವತಂತ್ರ ಸೇವೆ · arena.ai" : "Independent service · arena.ai"}
            </p>
          </div>
          <ExternalLink className="h-4 w-4 text-violet-200" />
        </button>
        <p className="mt-4 text-center text-[8.5px] text-muted-app">
          {t("bookmarkCount")}: {bookmarkTotal} · {t("allTools")}: 13
        </p>
      </div>
    </div>
  );
}


