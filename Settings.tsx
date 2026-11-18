import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  ArrowUpRight,
  Bell,
  Camera,
  Check,
  ChevronRight,
  ClipboardPaste,
  Eye,
  EyeOff,
  Fingerprint,
  Info,
  KeyRound,
  Languages,
  Lock,
  Moon,
  Pencil,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sun,
  Trash2,
  Wifi,
  X,
} from "lucide-react";
import { useApp } from "../store";
import { apiKeyDefs, type ApiKeyId } from "../data";
import { Btn, MenuRow, Notice, ScreenHeader, SecretField, Sheet, Toggle } from "../components/ui";
import { LogoMark } from "../components/Brand";

/* --------------------------------- Settings -------------------------------- */

export function SettingsScreen() {
  const {
    t,
    lang,
    setLang,
    theme,
    setTheme,
    notifications,
    setNotifications,
    navigate,
    keys,
    configuredCount,
    resetLocalData,
    bookmarks,
  } = useApp();
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("settingsTitle")} subtitle={t("settingsSub")} accent="#a78bfa" />
      <div className="px-5">
        {/* profile */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-300/20 bg-[linear-gradient(125deg,#1b1038,#2b1150_52%,#3d1447)] p-4">
          <div className="absolute -top-10 -right-6 h-28 w-28 rounded-full bg-violet-500/25 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 font-display text-[18px] font-extrabold text-white">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[14px] font-extrabold text-white">{t("guest")}</p>
              <p className="mt-0.5 truncate text-[9px] text-violet-200/70">{t("guestSub")}</p>
            </div>
            <span className="flex items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-1 text-[8px] font-bold text-emerald-300">
              <ShieldCheck className="h-2.5 w-2.5" /> {t("secure")}
            </span>
          </div>
          <div className="relative mt-3 grid grid-cols-3 gap-1.5">
            {[
              { value: String(configuredCount), label: t("apiKeys") },
              { value: String(bookmarks.length), label: t("bookmarks") },
              { value: "13", label: t("toolsCount") },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-1.5 text-center">
                <p className="font-display text-[13px] leading-none font-extrabold text-white">{stat.value}</p>
                <p className="mt-1 truncate text-[7.5px] font-semibold text-violet-200/65">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* language */}
        <section className="mt-4">
          <p className="mb-2 text-[9.5px] font-bold tracking-[0.14em] text-muted-app uppercase">{t("language")}</p>
          <div className="rounded-2xl border border-hair bg-[var(--surface)] p-3">
            <div className="grid grid-cols-2 gap-2">
              {([
                { id: "en" as const, label: "English", native: "English", script: "Aa" },
                { id: "kn" as const, label: "ಕನ್ನಡ", native: "ಕನ್ನಡ", script: "ಅ" },
              ]).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setLang(option.id)}
                  className={`press relative flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                    lang === option.id
                      ? "border-violet-400/50 bg-violet-500/12"
                      : "border-hair bg-white/[0.025]"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg font-display text-[12px] font-extrabold ${
                      lang === option.id ? "bg-violet-500/25 text-violet-200" : "bg-white/[0.05] text-muted-app"
                    }`}
                  >
                    {option.script}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold text-app">{option.label}</p>
                    <p className="truncate text-[8px] text-muted-app">{option.native}</p>
                  </div>
                  {lang === option.id && (
                    <span className="absolute top-2 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-violet-500 text-white">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="mt-2 flex items-center gap-1 text-[8.5px] text-muted-app">
              <Languages className="h-2.5 w-2.5" /> {lang === "kn" ? "ಆ್ಯಪ್ ಈಗ ಕನ್ನಡದಲ್ಲಿದೆ" : "The whole app switches language instantly"}
            </p>
          </div>
        </section>

        {/* theme */}
        <section className="mt-4">
          <p className="mb-2 text-[9.5px] font-bold tracking-[0.14em] text-muted-app uppercase">{t("appearance")}</p>
          <div className="grid grid-cols-2 gap-2">
            {([
              { id: "dark" as const, label: t("dark"), icon: <Moon className="h-3.5 w-3.5" />, bg: "#0a1024", card: "#141c3a", accent: "#a78bfa" },
              { id: "light" as const, label: t("light"), icon: <Sun className="h-3.5 w-3.5" />, bg: "#f5f6fc", card: "#ffffff", accent: "#7c3aed" },
            ]).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTheme(option.id)}
                className={`press relative overflow-hidden rounded-2xl border p-2 text-left transition ${
                  theme === option.id ? "border-violet-400/60 shadow-[0_0_0_2px_rgba(139,92,246,.16)]" : "border-hair"
                }`}
                style={{ background: option.bg }}
              >
                <div className="mx-auto w-full max-w-[104px] rounded-lg p-1.5" style={{ background: option.card, border: `1px solid ${option.id === "dark" ? "#26305a" : "#e6e7f4"}` }}>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ background: option.accent }} />
                    <span className="h-1 w-8 rounded-full" style={{ background: option.id === "dark" ? "#3b4675" : "#d9dbef" }} />
                  </div>
                  <div className="mt-1.5 grid grid-cols-3 gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-4 rounded" style={{ background: i === 0 ? option.accent : option.id === "dark" ? "#222c52" : "#eef0fa" }} />
                    ))}
                  </div>
                  <div className="mt-1.5 h-1 rounded-full" style={{ background: option.id === "dark" ? "#2a345c" : "#e3e5f2" }} />
                  <div className="mt-1 h-1 w-2/3 rounded-full" style={{ background: option.id === "dark" ? "#222c52" : "#eceefa" }} />
                </div>
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  {option.icon}
                  <span className={`text-[10px] font-bold ${option.id === "dark" ? "text-violet-100" : "text-[#1b1740]"}`}>{option.label}</span>
                  {theme === option.id && <Check className="h-3 w-3" style={{ color: option.id === "dark" ? "#34d399" : "#16a34a" }} />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* keys */}
        <section className="mt-4">
          <p className="mb-2 text-[9.5px] font-bold tracking-[0.14em] text-muted-app uppercase">{t("security")}</p>
          <button
            type="button"
            onClick={() => navigate({ name: "keys" })}
            className="press relative mb-2 w-full overflow-hidden rounded-2xl border border-emerald-400/20 bg-[linear-gradient(120deg,rgba(16,185,129,.11),rgba(139,92,246,.12))] p-3.5 text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                <KeyRound className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-extrabold text-app">{t("apiKeys")}</p>
                <p className="mt-0.5 text-[8.5px] text-muted-app">{t("apiKeysSub")}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-[14px] leading-none font-extrabold text-emerald-300">{configuredCount}/7</p>
                <p className="mt-0.5 text-[7.5px] font-bold text-muted-app">{t("configured")}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-app" />
            </div>
            <div className="mt-2.5 flex gap-1">
              {apiKeyDefs.map((def) => (
                <span
                  key={def.id}
                  className="h-1 flex-1 rounded-full"
                  style={{ background: keys[def.id] ? "#34d399" : "rgba(255,255,255,.1)" }}
                />
              ))}
            </div>
          </button>

          <div className="overflow-hidden rounded-2xl border border-hair bg-[var(--surface)]">
            <div className="flex items-center gap-3 border-b border-hair px-3.5 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.045] text-soft">
                <Bell className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-bold text-app">{t("notifications")}</p>
                <p className="text-[9px] text-muted-app">{t("notificationsSub")}</p>
              </div>
              <Toggle checked={notifications} onChange={setNotifications} label={t("notifications")} />
            </div>
            <MenuRow
              icon={<ShieldCheck className="h-4 w-4" />}
              title={t("androidPermissions")}
              subtitle={t("androidPermissionsSub")}
              onClick={() => setPermissionsOpen(true)}
            />
            <MenuRow
              icon={<Lock className="h-4 w-4" />}
              title={t("privacyPolicy")}
              subtitle={t("privacyFirst")}
              onClick={() => navigate({ name: "privacy" })}
            />
            <MenuRow
              icon={<Info className="h-4 w-4" />}
              title={t("aboutApp")}
              subtitle={`AI HUB · v1.0.0`}
              onClick={() => navigate({ name: "about" })}
              last
            />
          </div>
        </section>

        {/* android */}
        <section className="mt-4">
          <div className="relative overflow-hidden rounded-2xl border border-sky-400/20 bg-[linear-gradient(120deg,#0a1c2b,#121a3b_60%,#1f1240)] p-4">
            <div className="absolute -top-10 -right-6 h-28 w-28 rounded-full bg-sky-400/15 blur-2xl" />
            <div className="relative flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-emerald-300">
                <Smartphone className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[12.5px] font-extrabold text-white">{t("apkTitle")}</p>
                <p className="mt-0.5 line-clamp-2 text-[8.5px] leading-relaxed text-white/60">{t("apkBody")}</p>
              </div>
            </div>
            <div className="relative mt-2.5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-2">
              <div className="flex items-center gap-1.5">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[8.5px] font-bold text-white/80">{t("comingSoon")} · v1.0.0</span>
              </div>
              <button type="button" onClick={() => navigate({ name: "about" })} className="text-[8.5px] font-bold text-sky-300">
                {t("aboutApp")}
              </button>
            </div>
          </div>
        </section>

        {/* reset */}
        <section className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-hair bg-[var(--surface)]">
            <MenuRow
              icon={<RotateCcw className="h-4 w-4" />}
              title={t("clearData")}
              subtitle={t("local")}
              danger
              last
              onClick={() => setResetOpen(true)}
            />
          </div>
          <button
            type="button"
            onClick={() => navigate({ name: "about" })}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-hair bg-white/[0.02] py-2.5 text-[9px] font-bold text-muted-app"
          >
            <LogoMark size={16} /> AI HUB · v1.0.0 · {t("local")}
          </button>
          <p className="mt-3 text-center text-[8px] leading-relaxed text-muted-app">{t("noPassword")}</p>
        </section>
      </div>

      <Sheet
        open={permissionsOpen}
        onClose={() => setPermissionsOpen(false)}
        title={t("androidPermissions")}
        footer={
          <Btn size="lg" variant="outline" onClick={() => setPermissionsOpen(false)}>
            {t("close")}
          </Btn>
        }
      >
        <div className="space-y-2">
          {[
            { icon: <Camera className="h-4 w-4" />, title: "Camera", body: "Used only by the QR scanner while it is open. No photos or video are recorded." },
            { icon: <Wifi className="h-4 w-4" />, title: "Internet", body: "Used to open official websites, load image previews and use search." },
            { icon: <Fingerprint className="h-4 w-4" />, title: "Secure storage", body: "API keys stay in local storage in this preview; Android should use Keystore-backed encryption." },
          ].map((item) => (
            <div key={item.title} className="flex gap-2.5 rounded-xl border border-hair bg-white/[0.02] p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/12 text-violet-300">{item.icon}</span>
              <div>
                <p className="text-[10.5px] font-bold text-app">{item.title}</p>
                <p className="mt-0.5 text-[9px] leading-relaxed text-muted-app">{item.body}</p>
              </div>
            </div>
          ))}
          <Notice tone="amber">{t("permissionsInfo")}</Notice>
        </div>
      </Sheet>

      <Sheet
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title={t("clearData")}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Btn variant="outline" onClick={() => setResetOpen(false)}>
              {t("cancel")}
            </Btn>
            <Btn
              variant="danger"
              onClick={() => {
                resetLocalData();
                setResetOpen(false);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" /> {t("delete")}
            </Btn>
          </div>
        }
      >
        <p className="text-[11px] leading-relaxed text-muted-app">{t("clearDataBody")}</p>
      </Sheet>
    </div>
  );
}

/* --------------------------------- API Keys -------------------------------- */

const keyAccent: Record<ApiKeyId, string> = {
  gemini: "#8ab4f8",
  openai: "#10a37f",
  claude: "#d97757",
  image: "#f472b6",
  video: "#818cf8",
  music: "#fbbf24",
  voice: "#34d399",
};

export function ApiKeysScreen() {
  const { t, lang, keys, saveKey, removeKey, configuredCount, pushToast } = useApp();
  const [editing, setEditing] = useState<ApiKeyId | null>(null);
  const [drafts, setDrafts] = useState<Partial<Record<ApiKeyId, string>>>({});
  const [visible, setVisible] = useState<Partial<Record<ApiKeyId, boolean>>>({});
  const [confirm, setConfirm] = useState<ApiKeyId | null>(null);

  const startEdit = (id: ApiKeyId) => {
    setDrafts((prev) => ({ ...prev, [id]: keys[id] ?? "" }));
    setEditing(id);
    setVisible((prev) => ({ ...prev, [id]: false }));
  };

  const pasteKey = async (id: ApiKeyId) => {
    try {
      if (!navigator.clipboard?.readText) throw new Error("clipboard");
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        pushToast(t("keyPasteFailed"), "error");
        return;
      }
      setDrafts((prev) => ({ ...prev, [id]: text.trim() }));
      setEditing(id);
      pushToast(t("keyPasted"), "success");
    } catch {
      pushToast(t("keyPasteFailed"), "error");
    }
  };

  const save = (id: ApiKeyId) => {
    const value = (drafts[id] ?? "").trim();
    if (!value) {
      pushToast(t("keyEmpty"), "error");
      return;
    }
    saveKey(id, value);
    setEditing(null);
  };

  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("keysTitle")} subtitle={t("keysSub")} accent="#34d399" />
      <div className="px-5">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-[linear-gradient(120deg,#0a2420,#111f36_55%,#201338)] p-4">
          <div className="absolute -top-8 -right-6 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="relative flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
              <Lock className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-[12px] font-extrabold text-white">
                {configuredCount}/7 {t("configured")}
              </p>
              <p className="mt-1 text-[9px] leading-relaxed text-white/65">{t("keysIntro")}</p>
            </div>
          </div>
          <div className="relative mt-3 grid grid-cols-3 gap-1.5">
            {[
              { icon: <EyeOff className="h-3 w-3" />, label: lang === "kn" ? "ಮರೆಮಾಡಲಾಗಿದೆ" : "Masked by default" },
              { icon: <Lock className="h-3 w-3" />, label: lang === "kn" ? "ಸ್ಥಳೀಯ ಸಂಗ್ರಹ" : "Local-only storage" },
              { icon: <ShieldCheck className="h-3 w-3" />, label: lang === "kn" ? "ಬ್ಯಾಕೆಂಡ್ ಸಿದ್ಧ" : "Backend ready" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.05] px-1.5 py-1.5">
                <span className="text-emerald-300">{item.icon}</span>
                <span className="truncate text-[7.5px] font-bold text-white/75">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {apiKeyDefs.map((def) => {
            const value = keys[def.id] ?? "";
            const configured = Boolean(value);
            const isEditing = editing === def.id;
            const isVisible = Boolean(visible[def.id]);
            const accent = keyAccent[def.id];
            return (
              <div key={def.id} className="overflow-hidden rounded-2xl border border-hair bg-[var(--surface)]">
                <div className="flex items-start gap-2.5 p-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                    style={{ background: `${accent}16`, borderColor: `${accent}30`, color: accent }}
                  >
                    <KeyRound className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-[11px] font-extrabold text-app">{lang === "kn" ? def.labelKn : def.label}</p>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[7.5px] font-bold ${
                          configured
                            ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                            : "border-white/10 bg-white/[0.04] text-muted-app"
                        }`}
                      >
                        <span className={`h-1 w-1 rounded-full ${configured ? "bg-emerald-400" : "bg-slate-500"}`} />
                        {configured ? t("saved") : t("notSet")}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[8.5px] text-muted-app">{def.provider}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeKey(def.id)}
                    aria-label={t("deleteKey")}
                    className={`press flex h-7 w-7 items-center justify-center rounded-lg border border-hair ${configured ? "text-rose-400 hover:bg-rose-500/10" : "text-muted-app/50"}`}
                    disabled={!configured}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>

                <div className="px-3 pb-3">
                  {isEditing ? (
                    <div>
                      <SecretField
                        value={drafts[def.id] ?? ""}
                        onChange={(v) => setDrafts((prev) => ({ ...prev, [def.id]: v }))}
                        placeholder={t("apiKeyPlaceholder")}
                        visible={isVisible}
                        onToggleVisible={() => setVisible((prev) => ({ ...prev, [def.id]: !prev[def.id] }))}
                      />
                      <div className="mt-2 flex gap-1.5">
                        <Btn size="sm" className="flex-1" onClick={() => save(def.id)}>
                          <Check className="h-3 w-3" /> {t("save")}
                        </Btn>
                        <Btn size="sm" variant="outline" onClick={() => pasteKey(def.id)}>
                          <ClipboardPaste className="h-3 w-3" /> {t("paste")}
                        </Btn>
                        <Btn
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditing(null);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Btn>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-1.5 rounded-xl border border-hair bg-white/[0.025] px-2.5 py-2">
                        <Fingerprint className="h-3.5 w-3.5 shrink-0 text-muted-app" />
                        <p className={`min-w-0 flex-1 truncate font-mono text-[10px] ${configured ? "text-soft" : "text-muted-app"}`}>
                          {configured
                            ? isVisible
                              ? value
                              : `${"•".repeat(Math.min(18, Math.max(10, value.length)))}${value.slice(-4)}`
                            : def.prefix}
                        </p>
                        {configured && (
                          <button
                            type="button"
                            aria-label={isVisible ? t("hide") : t("show")}
                            onClick={() => setVisible((prev) => ({ ...prev, [def.id]: !prev[def.id] }))}
                            className="press rounded-md p-1 text-muted-app hover:text-soft"
                          >
                            {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        )}
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-1.5">
                        <Btn size="sm" variant="outline" onClick={() => startEdit(def.id)}>
                          <Pencil className="h-3 w-3" /> {configured ? t("edit") : t("add")}
                        </Btn>
                        <Btn size="sm" variant="outline" onClick={() => pasteKey(def.id)}>
                          <ClipboardPaste className="h-3 w-3" /> {t("paste")}
                        </Btn>
                        <Btn
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(def.id)}
                        >
                          <Eye className="h-3 w-3" /> {t("manage")}
                        </Btn>
                      </div>
                      <div className="mt-2 flex items-start justify-between gap-2">
                        <p className="text-[8px] leading-relaxed text-muted-app">{def.note}</p>
                        <a
                          href={def.docs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex shrink-0 items-center gap-0.5 text-[8px] font-bold text-violet-300"
                        >
                          {t("getKey")} <ArrowUpRight className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3">
          <Notice tone="amber" icon={<ShieldCheck className="h-4 w-4" />}>{t("localOnly")}</Notice>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-hair bg-white/[0.02] p-3">
          <Lock className="h-4 w-4 shrink-0 text-emerald-300" />
          <p className="text-[9px] leading-relaxed text-muted-app">
            {lang === "kn"
              ? "Arena AI ಮತ್ತು ಇತರ ವೆಬ್ ಸೇವೆಗಳಿಗೆ API ಕೀ ಅಗತ್ಯವಿಲ್ಲ — ಅವು ಅಧಿಕೃತ ತಾಣದಲ್ಲಿ ನೇರವಾಗಿ ತೆರೆಯುತ್ತವೆ."
              : "Arena AI and the other web services need no API key — they open directly on their official sites."}
          </p>
        </div>
        <p className="mt-3 text-center text-[8px] text-muted-app">
          {lang === "kn" ? "ಕೀ ಮೌಲ್ಯಗಳನ್ನು ಎಂದಿಗೂ ಲಾಗ್ ಮಾಡಲಾಗುವುದಿಲ್ಲ." : "Key values are never logged or sent anywhere by this preview."}
        </p>
      </div>

      <Sheet
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        title={t("deleteKey")}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Btn variant="outline" onClick={() => setConfirm(null)}>
              {t("cancel")}
            </Btn>
            <Btn
              variant="danger"
              onClick={() => {
                if (confirm) removeKey(confirm);
                setConfirm(null);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" /> {t("delete")}
            </Btn>
          </div>
        }
      >
        <p className="text-[11px] leading-relaxed text-muted-app">
          {lang === "kn" ? "ಈ ಕೀಯನ್ನು ಈ ಸಾಧನದಿಂದ ತೆಗೆದುಹಾಕಲಾಗುತ್ತದೆ." : "This removes the key from this device. You can add it again any time."}
        </p>
      </Sheet>
    </div>
  );
}

/* ---------------------------- QR install card ------------------------------ */

export function InstallQrCard() {
  const { t, copyText, pushToast } = useApp();
  const [qr, setQr] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const url = `${window.location.origin}${window.location.pathname}`;
    setLink(url);
    QRCode.toDataURL(url, { width: 320, margin: 1, color: { dark: "#0c1024", light: "#ffffff" } })
      .then(setQr)
      .catch(() => setQr(""));
  }, []);

  return (
    <div className="rounded-2xl border border-hair bg-[var(--surface)] p-3">
      <div className="flex items-center gap-3">
        {qr ? (
          <img src={qr} alt="QR code to open AI HUB" className="h-[68px] w-[68px] rounded-lg bg-white p-1" />
        ) : (
          <div className="skeleton h-[68px] w-[68px] rounded-lg" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] font-extrabold text-app">{t("scanToOpen")}</p>
          <p className="mt-0.5 truncate font-mono text-[8px] text-muted-app">{link}</p>
          <div className="mt-1.5 flex gap-1.5">
            <button
              type="button"
              onClick={() => copyText(link, t("copied"))}
              className="rounded-md border border-hair bg-white/[0.04] px-2 py-1 text-[8px] font-bold text-soft"
            >
              {t("copy")}
            </button>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) navigator.share({ title: "AI HUB", url: link }).catch(() => undefined);
                else {
                  copyText(link, t("copied"));
                  pushToast(t("copied"), "info");
                }
              }}
              className="rounded-md border border-hair bg-white/[0.04] px-2 py-1 text-[8px] font-bold text-soft"
            >
              {t("share")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


