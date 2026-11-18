import { useState } from "react";
import {
  ArrowUpRight,
  Bell,
  BellOff,
  Camera,
  CheckCheck,
  ExternalLink,
  Folder,
  Globe,
  Heart,
  KeyRound,
  Lock,
  QrCode,
  Settings as SettingsIcon,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useApp } from "../store";
import { Btn, MenuRow, Notice, ScreenHeader, Toggle } from "../components/ui";
import { BrandIcon, LogoMark } from "../components/Brand";
import { InstallQrCard } from "./Settings";
import { ARENA_URL } from "../data";

/* -------------------------------- Privacy -------------------------------- */

export function PrivacyScreen() {
  const { t, lang, navigate, theme } = useApp();
  const kn = lang === "kn";

  const sections = [
    {
      icon: <Lock className="h-4 w-4" />,
      title: kn ? "ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಉಳಿಯುವುದು" : "What stays on your device",
      body: kn
        ? "ಬುಕ್‌ಮಾರ್ಕ್‌ಗಳು, ಭಾಷೆ ಮತ್ತು ಥೀಮ್ ಆಯ್ಕೆ, ಮತ್ತು ನೀವು ಸೇರಿಸುವ API ಕೀಗಳು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನ ಸ್ಥಳೀಯ ಸಂಗ್ರಹದಲ್ಲಿ ಮಾತ್ರ ಇರುತ್ತವೆ. ಈ ಮುನ್ನೋಟದಲ್ಲಿ ಕೀಗಳನ್ನು ಅಸ್ಪಷ್ಟಗೊಳಿಸಿ ಉಳಿಸಲಾಗುತ್ತದೆ; ಉತ್ಪಾದನಾ Android ಆವೃತ್ತಿಯಲ್ಲಿ Keystore-ಆಧಾರಿತ ಗೂಢಲಿಪೀಕರಣ ಬಳಸಬೇಕು."
        : "Bookmarks, language and theme choices, and any API keys you add live in this browser's local storage on your device. This preview obfuscates saved keys at rest; a production Android build should use Keystore-backed encryption.",
    },
    {
      icon: <EyeOffIcon />,
      title: kn ? "ನಾವು ಎಂದಿಗೂ ಸಂಗ್ರಹಿಸದಿರುವುದು" : "What we never collect",
      body: kn
        ? "ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಖಾತೆಗಳ ಪಾಸ್‌ವರ್ಡ್‌ಗಳು, ಖಾಸಗಿ ಸಂದೇಶಗಳು, ಇನ್‌ಬಾಕ್ಸ್ ವಿಷಯ, ನಿಮ್ಮ ಆಯ್ಕೆ ಮಾಡಿದ ಫೈಲ್‌ಗಳು, ಸ್ಥಳ, ಸಂಪರ್ಕಗಳು ಅಥವಾ ವೆಬ್ ಇತಿಹಾಸ. AI HUB ಹಿನ್ನೆಲೆ ಟ್ರ್ಯಾಕಿಂಗ್ ಅಥವಾ ಜಾಹೀರಾತು SDK ಬಳಸುವುದಿಲ್ಲ."
        : "Third-party account passwords, private messages, inbox content, your picked files, location, contacts or browsing history. AI HUB does not run background tracking or advertising SDKs.",
    },
    {
      icon: <Globe className="h-4 w-4" />,
      title: kn ? "ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಸೇವೆಗಳು" : "Third-party services",
      body: kn
        ? "Gemini, ChatGPT, Claude, Flow AI, Arena AI, Gmail, Meta, WhatsApp, Facebook, Instagram ಮತ್ತು ಸೃಜನಶೀಲ ಸಾಧನಗಳು ತಮ್ಮದೇ ವೆಬ್‌ಸೈಟ್‌ಗಳಲ್ಲಿ ತೆರೆಯುತ್ತವೆ. ಅಲ್ಲಿ ಲಾಗಿನ್ ಮತ್ತು ಖಾತೆ ಭದ್ರತೆ ಆ ಸೇವೆಗಳಿಗೇ ಸೇರಿದ್ದು, ಅವರ ಗೋಪ್ಯತಾ ನೀತಿ ಅನ್ವಯವಾಗುತ್ತದೆ."
        : "Gemini, ChatGPT, Claude, Flow AI, Arena AI, Gmail, Meta, WhatsApp, Facebook, Instagram and the creative tools open on their own websites. Sign-in and account security there belong to those providers, and their policies apply.",
    },
    {
      icon: <Sparkles className="h-4 w-4" />,
      title: kn ? "ಚಿತ್ರ ಮುನ್ನೋಟಗಳು" : "Instant image previews",
      body: kn
        ? "ಚಿತ್ರ ಮುನ್ನೋಟದ ಪ್ರಾಂಪ್ಟ್ ಅನ್ನು Pollinations ಸಾರ್ವಜನಿಕ ಸೇವೆಗೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ. ಬೇರೆ AI ಸೃಜನೆಗಳು ಅಧಿಕೃತ ಸೇವೆಗಳಲ್ಲಿ ನಡೆಯುತ್ತವೆ. ನಿಮ್ಮ ಸ್ವಂತ API ಕೀಗಳನ್ನು ಬಳಸುವಾಗ ಬ್ಯಾಕೆಂಡ್ ಮೂಲಕ ಮಾತ್ರ ಕರೆ ಮಾಡಿ."
        : "An image preview prompt is sent to Pollinations' public service. Other AI creations happen on the official provider sites. If you use your own API keys, route requests through your secure backend.",
    },
    {
      icon: <Camera className="h-4 w-4" />,
      title: kn ? "ಕ್ಯಾಮೆರಾ ಮತ್ತು ಫೈಲ್‌ಗಳು" : "Camera & files",
      body: kn
        ? "QR ಸ್ಕ್ಯಾನ್ ಪ್ರಾರಂಭಿಸಿದಾಗ ಮಾತ್ರ ಕ್ಯಾಮೆರಾ ಅನುಮತಿ ಕೇಳಲಾಗುತ್ತದೆ, ಮತ್ತು ನಿಲ್ಲಿಸಿದಾಗ ಸ್ಟ್ರೀಮ್ ತಕ್ಷಣ ನಿಲ್ಲುತ್ತದೆ. ಫೈಲ್‌ಗಳು ನೀವು ಆಯ್ಕೆ ಮಾಡಿದಾಗ ಮಾತ್ರ ತೆರೆಯುತ್ತವೆ ಮತ್ತು ನೀವು ಹಂಚಿಕೊಳ್ಳುವವರೆಗೆ ಎಲ್ಲಿಯೂ ಅಪ್‌ಲೋಡ್ ಆಗುವುದಿಲ್ಲ."
        : "Camera permission is requested only when you start a QR scan, and the stream stops immediately when you stop. Files are read only when you pick them and are never uploaded unless you choose to share them.",
    },
    {
      icon: <Trash2 className="h-4 w-4" />,
      title: kn ? "ನಿಮ್ಮ ನಿಯಂತ್ರಣ" : "Your controls",
      body: kn
        ? "ಸೆಟ್ಟಿಂಗ್‌ನಲ್ಲಿ ಯಾವುದೇ ಕೀ ಅಳಿಸಬಹುದು, ಬುಕ್‌ಮಾರ್ಕ್ ತೆಗೆಯಬಹುದು, ಅಥವಾ ಸ್ಥಳೀಯ ಡೇಟಾವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಮರುಹೊಂದಿಸಬಹುದು. ಖಾತೆ ರಚಿಸುವ ಅಗತ್ಯವಿಲ್ಲ."
        : "Delete any key, remove a bookmark or reset all local data from Settings at any time. No account is required to use this workspace.",
    },
  ];

  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("privacyTitle")} subtitle={t("privacyUpdated")} accent="#34d399" />
      <div className="px-5">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-[linear-gradient(125deg,#07211d,#0d2033_60%,#1f1232)] p-4">
          <div className="absolute -top-8 -right-4 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-400/10 text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-[13px] font-extrabold text-white">{t("privacyFirst")}</p>
              <p className="mt-0.5 text-[9px] leading-relaxed text-white/60">
                {kn ? "ನಿಮ್ಮ ಡೇಟಾ ನಿಮ್ಮದೇ. ಸ್ಪಷ್ಟವಾಗಿ, ಸರಳವಾಗಿ." : "Your data is yours. Clearly and simply."}
              </p>
            </div>
          </div>
          <div className="relative mt-3 grid grid-cols-3 gap-1.5">
            {[
              { label: kn ? "ಖಾತೆ ಇಲ್ಲ" : "No account" },
              { label: kn ? "ಟ್ರ್ಯಾಕಿಂಗ್ ಇಲ್ಲ" : "No tracking" },
              { label: kn ? "ಸ್ಥಳೀಯ ಫೈಲ್" : "Local files" },
            ].map((item) => (
              <span key={item.label} className="rounded-lg border border-white/10 bg-white/[0.06] px-1.5 py-1 text-center text-[7.5px] font-bold text-white/75">
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-hair bg-[var(--surface)] p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300">
                  {section.icon}
                </span>
                <p className="text-[11px] font-extrabold text-app">{section.title}</p>
              </div>
              <p className="mt-2 text-[9.5px] leading-relaxed text-muted-app">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <Notice tone="green" icon={<Lock className="h-4 w-4" />}>{t("noPassword")}</Notice>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Btn variant="outline" size="sm" onClick={() => navigate({ name: "settings" })}>
            <SettingsIcon className="h-3 w-3" /> {t("clearData")}
          </Btn>
          <Btn variant="outline" size="sm" onClick={() => navigate({ name: "keys" })}>
            <KeyRound className="h-3 w-3" /> {t("apiKeys")}
          </Btn>
        </div>

        <p className="mt-4 text-center text-[8px] leading-relaxed text-muted-app">
          {kn
            ? "ಈ ನೀತಿಯು AI HUB ಮುನ್ನೋಟಕ್ಕೆ ಅನ್ವಯಿಸುತ್ತದೆ. ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಸೇವೆಗಳು ತಮ್ಮದೇ ನೀತಿಗಳನ್ನು ಹೊಂದಿವೆ."
            : "This policy covers the AI HUB workspace. Linked third-party services have their own privacy policies."}
          <br />© 2026 AI HUB · {theme === "dark" ? "Dark" : "Light"} · v1.0.0
        </p>
      </div>
    </div>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.5 10.5 0 0112 5c5 0 9 4.5 10 7a14 14 0 01-2.4 3.5M6.6 6.6A14 14 0 002 12c1 2.5 5 7 10 7 1.7 0 3.3-.5 4.7-1.3" />
    </svg>
  );
}

/* --------------------------------- About --------------------------------- */

export function AboutScreen() {
  const { t, lang, navigate, launch, bookmarks } = useApp();
  const kn = lang === "kn";
  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("aboutTitle")} subtitle="AI HUB · v1.0.0" accent="#a78bfa" />
      <div className="px-5">
        <div className="relative overflow-hidden rounded-3xl border border-violet-300/20 bg-[linear-gradient(145deg,#150d2b,#241046_48%,#45174a)] px-5 pt-6 pb-5 text-center">
          <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-violet-500/25 blur-3xl" />
          <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="animate-float relative mx-auto w-fit">
            <LogoMark size={78} />
          </div>
          <h2 className="relative mt-1 font-display text-[26px] font-extrabold tracking-tight text-white">
            AI <span className="neon-text">HUB</span>
          </h2>
          <p className="relative mt-1 text-[10px] font-semibold tracking-[0.16em] text-violet-200/75 uppercase">{t("tagline")}</p>
          <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[8.5px] font-bold text-white/85">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" /> v1.0.0 · {t("local")}
          </div>
          <div className="relative mt-4 grid grid-cols-3 gap-1.5">
            {[
              { value: "13", label: t("toolsCount") },
              { value: "7", label: t("apiKeys") },
              { value: String(bookmarks.length), label: t("bookmarks") },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.06] px-1.5 py-2">
                <p className="font-display text-[16px] leading-none font-extrabold text-white">{stat.value}</p>
                <p className="mt-1 truncate text-[7.5px] font-semibold text-violet-200/65">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-hair bg-[var(--surface)] p-3.5">
          <p className="font-display text-[11.5px] font-bold text-app">{t("workspace")}</p>
          <p className="mt-1.5 text-[9.5px] leading-relaxed text-muted-app">{t("aboutBody")}</p>
          <p className="mt-2 text-[9.5px] leading-relaxed text-muted-app">{t("aboutBodyKn")}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Kotlin", "Jetpack Compose", "Room", "DataStore", "Kannada + English", "Dark / Light"].map((tag) => (
              <span key={tag} className="rounded-full border border-hair bg-white/[0.04] px-2 py-1 text-[8px] font-bold text-soft">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2 overflow-hidden rounded-2xl border border-hair bg-[var(--surface)]">
          <MenuRow icon={<ShieldCheck className="h-4 w-4" />} title={t("privacyPolicy")} onClick={() => navigate({ name: "privacy" })} />
          <MenuRow icon={<KeyRound className="h-4 w-4" />} title={t("apiKeys")} onClick={() => navigate({ name: "keys" })} />
          <MenuRow
            icon={<Camera className="h-4 w-4" />}
            title={t("androidPermissions")}
            subtitle="Camera · Internet"
            onClick={() => navigate({ name: "settings" })}
          />
          <MenuRow
            icon={<Smartphone className="h-4 w-4" />}
            title={t("apkTitle")}
            subtitle={t("comingSoon")}
            onClick={() => launch(ARENA_URL)}
            last
          />
        </div>

        <div className="mt-3">
          <InstallQrCard />
        </div>

        <div className="mt-3 rounded-2xl border border-hair bg-white/[0.02] p-3.5">
          <p className="flex items-center gap-1.5 text-[10px] font-extrabold text-app">
            <Lock className="h-3.5 w-3.5 text-emerald-300" /> {t("noPassword")}
          </p>
          <p className="mt-2 text-[8.5px] leading-relaxed text-muted-app">{t("aboutIndependent")}</p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Btn size="sm" variant="outline" onClick={() => navigate({ name: "privacy" })}>
            <ShieldCheck className="h-3 w-3" /> {t("privacyTitle")}
          </Btn>
          <Btn size="sm" onClick={() => launch(ARENA_URL)}>
            Arena AI <ExternalLink className="h-3 w-3" />
          </Btn>
        </div>

        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-[8.5px] font-semibold text-muted-app">
            {kn ? "ಕರ್ನಾಟಕದಲ್ಲಿ" : "Made with"} <Heart className="h-3 w-3 text-rose-400" fill="currentColor" /> {kn ? "ಪ್ರೀತಿಯಿಂದ" : "in India"}
          </div>
          <p className="text-[8px] text-muted-app">© 2026 AI HUB · {t("aboutTitle")}</p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Notifications ----------------------------- */

export function NotificationsScreen() {
  const { t, lang, notifications, setNotifications, navigate, launch } = useApp();
  const [read, setRead] = useState<string[]>([]);
  const kn = lang === "kn";

  const items = [
    {
      id: "arena",
      icon: <BrandIcon icon="arena" size={34} />,
      title: kn ? "Arena AI ಸಿದ್ಧವಾಗಿದೆ" : "Arena AI is one tap away",
      body: kn
        ? "ಸ್ವತಂತ್ರ AI ಅರೇನಾವನ್ನು ತೆರೆಯಿರಿ. ಲಾಗಿನ್ ಮತ್ತು ಸೈನ್ ಅಪ್ arena.ai ನಲ್ಲಿಯೇ."
        : "Open the independent AI arena. Login and Sign Up happen entirely on arena.ai.",
      action: () => launch(ARENA_URL),
      cta: t("open"),
    },
    {
      id: "keys",
      icon: (
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
          <KeyRound className="h-4 w-4" />
        </span>
      ),
      title: kn ? "ನಿಮ್ಮ API ಕೀಗಳು, ಸುರಕ್ಷಿತವಾಗಿ" : "Your keys stay yours",
      body: kn
        ? "ಕೀಗಳು ಡೀಫಾಲ್ಟ್ ಆಗಿ ಮರೆಯಾಗಿರುತ್ತವೆ. ಸೆಟ್ಟಿಂಗ್‌ನಲ್ಲಿ ಪೇಸ್ಟ್, ಉಳಿಸಿ, ಸಂಪಾದಿಸಿ ಅಥವಾ ಅಳಿಸಿ."
        : "Keys are masked by default. Paste, save, edit or delete them from Settings whenever you like.",
      action: () => navigate({ name: "keys" }),
      cta: t("manage"),
    },
    {
      id: "qr",
      icon: (
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
          <QrCode className="h-4 w-4" />
        </span>
      ),
      title: kn ? "Wi-Fi QR ಕೋಡ್ ಬೆಂಬಲ" : "Wi-Fi QR codes are here",
      body: kn
        ? "ನಿಮ್ಮ Wi-Fi ಕೋಡ್ ರಚಿಸಿ, PNG ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಹಂಚಿಕೊಳ್ಳಿ."
        : "Create a scannable Wi-Fi code, download it as a PNG or share it with a friend.",
      action: () => navigate({ name: "tool", tool: "qrgen" }),
      cta: t("create"),
    },
    {
      id: "files",
      icon: (
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
          <Folder className="h-4 w-4" />
        </span>
      ),
      title: kn ? "ಫೈಲ್‌ಗಳು ಸಾಧನದಲ್ಲೇ" : "Files that never leave your device",
      body: kn
        ? "ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ, ಹಂಚಿಕೊಳ್ಳಿ ಅಥವಾ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ — ನಾವು ಏನನ್ನೂ ಅಪ್‌ಲೋಡ್ ಮಾಡುವುದಿಲ್ಲ."
        : "Pick, share or download files — nothing is uploaded by AI HUB.",
      action: () => navigate({ name: "tool", tool: "files" }),
      cta: t("open"),
    },
  ];

  return (
    <div className="screen-in pb-4">
      <ScreenHeader
        title={t("notificationsTitle")}
        subtitle={notifications ? t("notificationsSub") : t("notificationsOff")}
        accent="#a78bfa"
        right={
          <button
            type="button"
            onClick={() => setRead(items.map((i) => i.id))}
            className="press flex h-8 items-center gap-1 rounded-lg border border-hair bg-white/[0.03] px-2 text-[8.5px] font-bold text-soft"
          >
            <CheckCheck className="h-3 w-3" /> {kn ? "ಎಲ್ಲವನ್ನೂ ಓದಿ" : "Mark read"}
          </button>
        }
      />
      <div className="px-5">
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-hair bg-[var(--surface)] p-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${notifications ? "bg-violet-500/12 text-violet-300" : "bg-white/[0.04] text-muted-app"}`}>
            {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-app">{t("notifications")}</p>
            <p className="text-[8.5px] text-muted-app">{notifications ? t("notificationsSub") : t("notificationsOff")}</p>
          </div>
          <Toggle checked={notifications} onChange={setNotifications} label={t("notifications")} />
        </div>

        {!notifications && (
          <div className="mb-3">
            <Notice tone="amber" icon={<BellOff className="h-4 w-4" />}>
              {kn ? "ಸೂಚನೆಗಳು ನಿಲ್ಲಿಸಲಾಗಿದೆ. ನೀವು ಬಯಸಿದಾಗ ಮತ್ತೆ ಸಕ್ರಿಯಗೊಳಿಸಬಹುದು." : "Notifications are paused. Turn them back on whenever you like."}
            </Notice>
          </div>
        )}

        <div className={`space-y-2 transition ${notifications ? "" : "opacity-60"}`}>
          {items.map((item) => {
            const isRead = read.includes(item.id);
            return (
              <div key={item.id} className="rounded-2xl border border-hair bg-[var(--surface)] p-3">
                <div className="flex items-start gap-2.5">
                  {item.icon}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-1.5">
                      <p className="flex-1 text-[10.5px] leading-snug font-extrabold text-app">{item.title}</p>
                      {!isRead && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />}
                    </div>
                    <p className="mt-1 text-[9px] leading-relaxed text-muted-app">{item.body}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={item.action}
                        className="press inline-flex items-center gap-1 rounded-lg border border-violet-400/20 bg-violet-500/10 px-2 py-1 text-[8.5px] font-bold text-violet-300"
                      >
                        {item.cta} <ArrowUpRight className="h-2.5 w-2.5" />
                      </button>
                      <span className="text-[7.5px] font-semibold text-muted-app">
                        {t("today")} · {item.id === "arena" ? "arena.ai" : "AI HUB"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {notifications && read.length === items.length && (
          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] py-2.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            <p className="text-[9px] font-bold text-emerald-300">{t("noNotifications")}</p>
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Btn size="sm" variant="outline" onClick={() => navigate({ name: "settings" })}>
            <SettingsIcon className="h-3 w-3" /> {t("openSettings")}
          </Btn>
          <Btn size="sm" variant="outline" onClick={() => navigate({ name: "keys" })}>
            <KeyRound className="h-3 w-3" /> {t("apiKeys")}
          </Btn>
        </div>
        <p className="mt-3 text-center text-[8px] text-muted-app">
          {kn ? "ಸ್ಥಳೀಯ ಸೂಚನೆಗಳು ಮಾತ್ರ · ಯಾವುದೇ ಪುಶ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಇಲ್ಲ" : "Local in-app updates only · no push tracking"}
        </p>
      </div>
    </div>
  );
}

export { Sparkles, Globe };
