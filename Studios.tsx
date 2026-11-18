import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clapperboard,
  Copy,
  Download,
  ExternalLink,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  Mail,
  Maximize2,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Volume2,
  Wand2,
} from "lucide-react";
import { useApp } from "../store";
import { Btn, Chip, Field, Notice, ScreenHeader } from "../components/ui";
import { BrandIcon } from "../components/Brand";
import { imageRatios, imageStyles, officialTools, type ApiKeyId } from "../data";
import { downloadFromUrl, shareText, shareUrl } from "../utils/media";

function KeyStatus({ id }: { id: ApiKeyId }) {
  const { keys, t, navigate } = useApp();
  const configured = Boolean(keys[id]);
  return (
    <button
      type="button"
      onClick={() => navigate({ name: "keys" })}
      className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left ${
        configured
          ? "border-emerald-400/20 bg-emerald-400/[0.06]"
          : "border-hair bg-white/[0.025]"
      }`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-lg ${
          configured ? "bg-emerald-400/15 text-emerald-300" : "bg-violet-500/12 text-violet-300"
        }`}
      >
        {configured ? <Check className="h-3.5 w-3.5" /> : <KeyRound className="h-3.5 w-3.5" />}
      </span>
      <span className="flex-1 text-[9.5px] leading-snug font-semibold text-soft">
        {configured ? t("keyConfiguredNote") : t("keyMissingNote")}
      </span>
      <span className="text-[8.5px] font-bold text-violet-300">{t("manage")}</span>
    </button>
  );
}

function ToolHero({
  icon,
  title,
  subtitle,
  accent,
}: {
  icon: "image" | "video" | "music" | "voice" | "gmail";
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className="px-5">
      <div
        className="relative overflow-hidden rounded-2xl border p-4"
        style={{
          borderColor: `${accent}33`,
          background: `linear-gradient(125deg, ${accent}22, var(--surface) 58%, ${accent}12)`,
        }}
      >
        <div className="absolute -top-10 -right-6 h-28 w-28 rounded-full blur-2xl" style={{ background: `${accent}33` }} />
        <div className="relative flex items-center gap-3">
          <BrandIcon icon={icon} size={44} />
          <div className="min-w-0 flex-1">
            <p className="font-display text-[14px] font-extrabold text-app">{title}</p>
            <p className="mt-0.5 text-[9.5px] leading-relaxed text-muted-app">{subtitle}</p>
          </div>
          <Sparkles className="h-5 w-5 shrink-0" style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}

function OfficialTools({ type }: { type: keyof typeof officialTools }) {
  const { t, launch } = useApp();
  return (
    <div className="mt-4 px-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-display text-[11.5px] font-bold text-app">{t("moreTools")}</p>
        <span className="text-[8.5px] text-muted-app">{t("official")}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {officialTools[type].map((tool) => (
          <button
            key={tool.name}
            type="button"
            onClick={() => launch(tool.url)}
            className="press flex flex-col gap-1 rounded-xl border border-hair bg-[var(--surface)] px-3 py-2.5 text-left hover:border-white/20"
          >
            <span className="flex w-full items-center justify-between gap-1">
              <span className="truncate text-[10px] font-extrabold text-app">{tool.name}</span>
              <ArrowUpRight className="h-3 w-3 shrink-0 text-muted-app" />
            </span>
            <span className="truncate text-[8.5px] text-muted-app">{tool.note}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ratioSize(ratio: string) {
  switch (ratio) {
    case "4:3":
      return { width: 1024, height: 768 };
    case "16:9":
      return { width: 1280, height: 720 };
    case "9:16":
      return { width: 720, height: 1280 };
    default:
      return { width: 1024, height: 1024 };
  }
}

export function ImageStudio() {
  const { t, lang, copyText, pushToast } = useApp();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(imageStyles[0]);
  const [ratio, setRatio] = useState("1:1");
  const [url, setUrl] = useState("");
  const [seed, setSeed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!loading || !url) return;
    const timeout = window.setTimeout(() => setLoading(false), 45000);
    return () => window.clearTimeout(timeout);
  }, [loading, url]);

  const generate = () => {
    const clean = prompt.trim();
    if (!clean) {
      pushToast(lang === "kn" ? "ಮೊದಲು ಪ್ರಾಂಪ್ಟ್ ಬರೆಯಿರಿ" : "Add a prompt to create an image", "error");
      return;
    }
    const nextSeed = Math.floor(Math.random() * 1_000_000);
    const { width, height } = ratioSize(ratio);
    const fullPrompt = `${clean}. ${style} style. Highly detailed, high quality, balanced ${ratio} composition, no text overlays.`;
    setSeed(nextSeed);
    setLoading(true);
    setFailed(false);
    setUrl(
      `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&seed=${nextSeed}&model=flux&nologo=true`,
    );
  };

  const handleDownload = async () => {
    if (!url) return;
    const ok = await downloadFromUrl(url, `ai-hub-image-${seed}.jpg`);
    pushToast(ok ? t("download") : t("generationError"), ok ? "success" : "error");
  };

  const handleShare = async () => {
    if (!url) return;
    const ok = await shareUrl(url, "AI HUB image");
    if (!ok) {
      copyText(url, t("copied"));
    }
  };

  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("imageTool")} subtitle={t("quickPreviewNote")} accent="#f472b6" />
      <ToolHero icon="image" title={t("promptStudio")} subtitle={t("describeImage")} accent="#f472b6" />
      <div className="mt-3 px-5">
        <div className="rounded-2xl border border-hair bg-[var(--surface)] p-3.5">
          <Field
            as="textarea"
            label={t("describeImage")}
            placeholder={t("imagePromptPlaceholder")}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={600}
          />
          <div className="mt-3">
            <p className="mb-1.5 text-[10px] font-bold text-soft">{t("style")}</p>
            <div className="flex flex-wrap gap-1.5">
              {imageStyles.map((s) => (
                <Chip key={s} active={style === s} onClick={() => setStyle(s)} color="#f472b6">
                  {s}
                </Chip>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="mb-1.5 text-[10px] font-bold text-soft">{t("aspect")}</p>
              <div className="flex gap-1.5">
                {imageRatios.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRatio(r)}
                    className={`press rounded-lg border px-2.5 py-1.5 text-[9.5px] font-bold ${
                      ratio === r
                        ? "border-pink-400/40 bg-pink-500/15 text-pink-200"
                        : "border-hair bg-white/[0.03] text-muted-app"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <Btn onClick={generate} disabled={loading} className="min-w-[112px]">
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
              {loading ? t("generating") : t("generate")}
            </Btn>
          </div>
        </div>
      </div>

      <div className="mt-3 px-5">
        <div className="relative overflow-hidden rounded-2xl border border-hair bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-hair px-3 py-2">
            <span className="flex items-center gap-1.5 text-[9.5px] font-bold text-muted-app">
              <ImageIcon className="h-3 w-3 text-pink-300" /> {t("livePreview")}
            </span>
            {url && !loading && (
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
            )}
          </div>
          {!url && !loading && (
            <div className="flex aspect-square flex-col items-center justify-center bg-[linear-gradient(150deg,rgba(244,114,182,.1),rgba(139,92,246,.08),transparent)] p-6 text-center">
              <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <Wand2 className="h-6 w-6 text-pink-300" />
              </span>
              <p className="font-display text-[17px] font-extrabold text-app">
                {lang === "kn" ? "ನಿಮ್ಮ ಕಲ್ಪನೆ ಚಿತ್ರವಾಗಲಿ" : "Imagine it. See it."}
              </p>
              <p className="mt-1.5 max-w-[220px] text-[10px] leading-relaxed text-muted-app">
                {lang === "kn"
                  ? "ವಿವರಣೆ ಬರೆಯಿರಿ, ಶೈಲಿ ಆಯ್ಕೆಮಾಡಿ, ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಚಿತ್ರ ಸೃಷ್ಟಿಸಿ."
                  : "Describe a scene, pick a style and bring it to life in a single click."}
              </p>
            </div>
          )}
          {url && (
            <div className="relative min-h-[300px] bg-[linear-gradient(150deg,rgba(244,114,182,.1),rgba(139,92,246,.08),transparent)]">
              {failed ? (
                <div className="flex aspect-square flex-col items-center justify-center gap-3 bg-white/[0.02] p-6 text-center">
                  <ImageIcon className="h-8 w-8 text-muted-app" />
                  <p className="text-[10.5px] text-muted-app">{t("generationError")}</p>
                  <Btn size="sm" variant="outline" onClick={generate}>
                    <RotateCcw className="h-3 w-3" /> {t("tryAgain")}
                  </Btn>
                </div>
              ) : (
                <>
                  <img
                    key={url}
                    src={url}
                    alt={prompt || "AI generated artwork"}
                    className={`aspect-square max-h-[46vh] w-full object-contain transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setLoading(false);
                      setFailed(true);
                    }}
                    referrerPolicy="no-referrer"
                  />
                  {loading && (
                    <div className="skeleton absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-white/70">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="text-[10px] font-bold">{t("generating")}</span>
                      </div>
                    </div>
                  )}
                  {!loading && (
                    <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                      <Btn size="sm" variant="primary" onClick={handleDownload} className="flex-1">
                        <Download className="h-3 w-3" /> {t("download")}
                      </Btn>
                      <Btn size="sm" variant="outline" onClick={handleShare} className="border-white/20 bg-black/30 text-white">
                        <Share2 className="h-3 w-3" /> {t("share")}
                      </Btn>
                      <Btn size="sm" variant="outline" onClick={() => copyText(url)} className="border-white/20 bg-black/30 text-white">
                        <Copy className="h-3 w-3" />
                      </Btn>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <p className="mt-2 text-[9px] leading-relaxed text-muted-app">{t("quickPreviewNote")}</p>
      </div>

      <div className="mt-3 px-5">
        <KeyStatus id="image" />
      </div>
      <OfficialTools type="image" />
    </div>
  );
}

export function VideoStudio() {
  const { t, copyText, lang, launch } = useApp();
  const [subject, setSubject] = useState("");
  const [camera, setCamera] = useState("Slow dolly forward");
  const [mood, setMood] = useState("Cinematic");
  const [duration, setDuration] = useState("5s");
  const [ratio, setRatio] = useState("16:9");

  const prompt = useMemo(
    () =>
      `${subject.trim() || "A futuristic Kannada city at night"}. ${camera.toLowerCase()}, ${mood.toLowerCase()} mood, ${duration} shot, ${ratio} aspect ratio, volumetric neon lighting, film grain, smooth motion, no text overlays.`,
    [subject, camera, mood, duration, ratio],
  );

  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("videoTool")} subtitle={t("videoSub")} accent="#818cf8" />
      <ToolHero icon="video" title={t("promptStudio")} subtitle={t("videoSub")} accent="#818cf8" />
      <div className="mt-3 px-5">
        <div className="rounded-2xl border border-hair bg-[var(--surface)] p-3.5">
          <Field
            as="textarea"
            label={t("subject")}
            placeholder={lang === "kn" ? "ಮಳೆಯಲ್ಲಿ ನೀಯಾನ್ ರಸ್ತೆ, ಕ್ಯಾಮೆರಾ ನಿಧಾನವಾಗಿ ಮುಂದೆ ಸಾಗುತ್ತದೆ…" : "A rain-soaked neon street, camera drifting forward…"}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <label className="block">
              <span className="mb-1.5 block text-[10.5px] font-bold text-soft">{t("camera")}</span>
              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="field w-full rounded-xl px-2.5 py-2.5 text-[10.5px]"
              >
                {["Slow dolly forward", "Aerial orbit", "Handheld close-up", "Static wide shot", "Crane reveal"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10.5px] font-bold text-soft">{t("duration")}</span>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="field w-full rounded-xl px-2.5 py-2.5 text-[10.5px]"
              >
                {["3s", "5s", "8s", "10s"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-3">
            <p className="mb-1.5 text-[10px] font-bold text-soft">{t("mood")}</p>
            <div className="flex flex-wrap gap-1.5">
              {["Cinematic", "Dreamy", "Cyberpunk", "Documentary", "Warm"].map((m) => (
                <Chip key={m} active={mood === m} onClick={() => setMood(m)} color="#818cf8">
                  {m}
                </Chip>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[10px] font-bold text-soft">{t("aspect")}</p>
            <div className="flex gap-1.5">
              {["16:9", "9:16", "1:1"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRatio(r)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[9.5px] font-bold ${
                    ratio === r ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-200" : "border-hair text-muted-app"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-hair bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-hair px-3 py-2">
            <span className="flex items-center gap-1.5 text-[9.5px] font-bold text-muted-app">
              <Clapperboard className="h-3 w-3 text-indigo-300" /> {t("createPrompt")}
            </span>
            <span className="rounded-full bg-indigo-500/15 px-1.5 py-0.5 text-[8px] font-bold text-indigo-300">
              {lang === "kn" ? "ಸಿದ್ಧ" : "Ready"}
            </span>
          </div>
          <div className="p-3">
            <p className="max-h-[112px] overflow-y-auto scroll-hide text-[10.5px] leading-relaxed text-soft">{prompt}</p>
            <div className="mt-3 flex gap-2">
              <Btn size="sm" onClick={() => copyText(prompt, t("promptCopied"))} className="flex-1">
                <Copy className="h-3 w-3" /> {t("copyPrompt")}
              </Btn>
              <Btn size="sm" variant="outline" onClick={() => shareText(prompt, "AI HUB video prompt")}>
                <Share2 className="h-3 w-3" />
              </Btn>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <KeyStatus id="video" />
        </div>
        <div className="mt-2">
          <Notice tone="amber" icon={<ShieldCheck className="h-4 w-4" />}>
            {t("backendRequired")}
          </Notice>
        </div>
        <Btn size="lg" className="mt-3" onClick={() => launch(officialTools.video[0].url)}>
          {lang === "kn" ? "Google Flow ನಲ್ಲಿ ರಚಿಸಿ" : "Create in Google Flow"} <ExternalLink className="h-3.5 w-3.5" />
        </Btn>
      </div>
      <OfficialTools type="video" />
    </div>
  );
}

export function MusicStudio() {
  const { t, copyText, lang, launch } = useApp();
  const [subject, setSubject] = useState("");
  const [genre, setGenre] = useState("Kannada indie");
  const [mood, setMood] = useState("Uplifting");
  const [tempo, setTempo] = useState(96);

  const prompt = useMemo(
    () =>
      `${subject.trim() || "A song about morning light over Bengaluru"}. ${genre}, ${mood.toLowerCase()} mood, ${tempo} BPM, warm vocals, clean modern production, memorable chorus, sung in Kannada and English.`,
    [subject, genre, mood, tempo],
  );

  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("musicTool")} subtitle={t("musicSub")} accent="#fbbf24" />
      <ToolHero icon="music" title={t("promptStudio")} subtitle={t("musicSub")} accent="#fbbf24" />
      <div className="mt-3 px-5">
        <div className="rounded-2xl border border-hair bg-[var(--surface)] p-3.5">
          <Field
            as="textarea"
            label={t("subject")}
            placeholder={lang === "kn" ? "ಬೆಳಗಿನ ಬೆಳಕು ಮತ್ತು ಹೊಸ ಆರಂಭದ ಬಗ್ಗೆ ಹಾಡು…" : "A song about morning light and new beginnings…"}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <div className="mt-3">
            <p className="mb-1.5 text-[10px] font-bold text-soft">{t("genre")}</p>
            <div className="flex flex-wrap gap-1.5">
              {["Kannada indie", "Pop", "Lo-fi", "Cinematic", "Devotional", "EDM"].map((g) => (
                <Chip key={g} active={genre === g} onClick={() => setGenre(g)} color="#fbbf24">
                  {g}
                </Chip>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="mb-1.5 text-[10px] font-bold text-soft">{t("mood")}</p>
            <div className="flex gap-1.5">
              {["Uplifting", "Calm", "Melancholic"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[9px] font-bold ${
                    mood === m ? "border-amber-400/40 bg-amber-400/15 text-amber-200" : "border-hair text-muted-app"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[10px] font-bold text-soft">{t("tempo")}</p>
              <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 font-mono text-[9px] text-amber-200">{tempo} BPM</span>
            </div>
            <input
              type="range"
              min={60}
              max={160}
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              className="range-accent w-full"
              aria-label={t("tempo")}
            />
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-hair bg-[linear-gradient(140deg,rgba(251,191,36,.09),var(--surface))]">
          <div className="flex items-center justify-between border-b border-hair px-3 py-2">
            <span className="flex items-center gap-1.5 text-[9.5px] font-bold text-muted-app">
              <Volume2 className="h-3 w-3 text-amber-300" /> {t("createPrompt")}
            </span>
            <span className="flex gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="w-0.5 rounded-full bg-amber-300/60" style={{ height: 6 + i * 3 }} />
              ))}
            </span>
          </div>
          <div className="p-3">
            <p className="text-[10.5px] leading-relaxed text-soft">{prompt}</p>
            <Btn size="sm" className="mt-3 w-full" onClick={() => copyText(prompt, t("promptCopied"))}>
              <Copy className="h-3 w-3" /> {t("copyPrompt")}
            </Btn>
          </div>
        </div>

        <div className="mt-3">
          <KeyStatus id="music" />
        </div>
        <div className="mt-2">
          <Notice tone="amber" icon={<ShieldCheck className="h-4 w-4" />}>
            {t("backendRequired")}
          </Notice>
        </div>
        <Btn size="lg" className="mt-3" onClick={() => launch("https://suno.com/")}>
          {lang === "kn" ? "Suno ನಲ್ಲಿ ಸಂಗೀತ ರಚಿಸಿ" : "Create music in Suno"} <ExternalLink className="h-3.5 w-3.5" />
        </Btn>
      </div>
      <OfficialTools type="music" />
    </div>
  );
}

export function VoiceStudio() {
  const { t, lang, launch, copyText } = useApp();
  const [script, setScript] = useState(
    "Namaskara! Welcome to AI HUB — your all-in-one AI workspace. Explore, create, and innovate.",
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState("");
  const [rate, setRate] = useState(0.95);
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      setVoices(all);
      if (!voiceName && all.length) {
        const preferred = all.find((v) => v.lang.toLowerCase().startsWith(lang === "kn" ? "kn" : "en")) ?? all[0];
        setVoiceName(preferred.name);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported, lang]);

  const speak = () => {
    if (!supported) return;
    const text = script.trim();
    if (!text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const selected = voices.find((v) => v.name === voiceName);
    if (selected) utter.voice = selected;
    utter.lang = selected?.lang ?? (lang === "kn" ? "kn-IN" : "en-US");
    utter.rate = rate;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const stop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("voiceTool")} subtitle={t("voiceSub")} accent="#34d399" />
      <ToolHero icon="voice" title={t("voice") + " preview"} subtitle={t("voiceSub")} accent="#34d399" />
      <div className="mt-3 px-5">
        {!supported ? (
          <Notice tone="amber">{t("voiceUnavailable")}</Notice>
        ) : (
          <div className="rounded-2xl border border-hair bg-[var(--surface)] p-3.5">
            <Field
              as="textarea"
              label={t("script")}
              placeholder={t("scriptPlaceholder")}
              value={script}
              onChange={(e) => setScript(e.target.value)}
              maxLength={500}
            />
            <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
              <label className="block">
                <span className="mb-1.5 block text-[10.5px] font-bold text-soft">{t("voice")}</span>
                <select
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  className="field w-full rounded-xl px-2.5 py-2.5 text-[10.5px]"
                >
                  {voices.length === 0 && <option value="">System default</option>}
                  {voices.map((v) => (
                    <option key={`${v.name}-${v.lang}`} value={v.name}>
                      {v.name} · {v.lang}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex items-end">
                <span className="flex h-[42px] items-center gap-1 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-2.5 text-[9px] font-bold text-emerald-300">
                  <ShieldCheck className="h-3 w-3" /> {t("local")}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <div className="mb-1.5 flex justify-between">
                <span className="text-[10px] font-bold text-soft">{t("rate")}</span>
                <span className="font-mono text-[9px] text-emerald-300">{rate.toFixed(2)}×</span>
              </div>
              <input
                type="range"
                min={0.6}
                max={1.6}
                step={0.05}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="range-accent w-full"
                aria-label={t("rate")}
              />
            </div>
            <div className="mt-4 flex gap-2">
              {speaking ? (
                <Btn size="lg" variant="danger" onClick={stop}>
                  <Pause className="h-3.5 w-3.5" /> {t("stop")}
                </Btn>
              ) : (
                <Btn size="lg" onClick={speak}>
                  <Play className="h-3.5 w-3.5" /> {t("speak")}
                </Btn>
              )}
            </div>
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Btn variant="outline" onClick={() => copyText(script, t("copied"))}>
            <Copy className="h-3.5 w-3.5" /> {t("copy")}
          </Btn>
          <Btn variant="outline" onClick={() => shareText(script, "AI HUB voice script")}>
            <Share2 className="h-3.5 w-3.5" /> {t("share")}
          </Btn>
        </div>
        <div className="mt-2 flex gap-2">
          <Btn variant="soft" size="sm" className="flex-1" onClick={() => setScript("Namaskara! ನಿಮ್ಮ ದಿನ ಶುಭವಾಗಿರಲಿ. AI HUB ನಿಮ್ಮ ಎಲ್ಲಾ AI ಸಾಧನಗಳ ಒಂದೇ ತಾಣ.")}>
            <Mic className="h-3 w-3" /> {t("kannada")}
          </Btn>
          <Btn variant="soft" size="sm" className="flex-1" onClick={() => setScript("Hello! I'm your AI HUB voice assistant. What would you like to create today?")}>
            <Mic className="h-3 w-3" /> English
          </Btn>
        </div>
        <div className="mt-3">
          <KeyStatus id="voice" />
        </div>
        <div className="mt-2">
          <Notice tone="green" icon={<ShieldCheck className="h-4 w-4" />}>
            {t("backendRequired")}
          </Notice>
        </div>
      </div>
      <OfficialTools type="voice" />
      <div className="mt-3 px-5">
        <Btn variant="outline" size="sm" className="w-full" onClick={() => launch("https://elevenlabs.io/")}>
          {t("voiceTool")} · ElevenLabs <ExternalLink className="h-3 w-3" />
        </Btn>
      </div>
    </div>
  );
}

export function GmailScreen() {
  const { t, launch, lang } = useApp();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("gmailTool")} subtitle={t("gmailSub")} accent="#ea4335" />
      <div className="px-5">
        <div className="relative overflow-hidden rounded-2xl border border-red-300/20 bg-[linear-gradient(125deg,#2a1414,#241a2e_55%,#171a38)] p-4">
          <div className="flex items-center gap-3">
            <BrandIcon icon="gmail" size={44} />
            <div>
              <p className="font-display text-[13px] font-extrabold text-white">{t("gmailSub")}</p>
              <p className="mt-0.5 text-[9px] text-white/60">mail.google.com · {t("officialSite")}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-hair bg-[var(--surface)] p-3.5">
          <Field label={t("recipient")} placeholder="name@example.com" value={to} onChange={(e) => setTo(e.target.value)} inputMode="email" />
          <div className="mt-2.5">
            <Field label={t("subjectLine")} placeholder={lang === "kn" ? "ವಿಷಯ" : "Subject"} value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="mt-2.5">
            <Field
              as="textarea"
              label={t("message")}
              placeholder={lang === "kn" ? "ನಿಮ್ಮ ಸಂದೇಶ…" : "Write your message…"}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <Btn size="lg" className="mt-3" onClick={() => launch(composeUrl)}>
            <Send className="h-3.5 w-3.5" /> {t("composeInGmail")}
          </Btn>
          <p className="mt-2 text-center text-[9px] leading-relaxed text-muted-app">{t("gmailNote")}</p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Btn variant="outline" onClick={() => launch("https://mail.google.com/")}>
            <Mail className="h-3.5 w-3.5" /> {t("openGmail")}
          </Btn>
          <Btn variant="outline" onClick={() => launch("https://accounts.google.com/")}>
            <Maximize2 className="h-3.5 w-3.5" /> {t("login")}
          </Btn>
        </div>

        <div className="mt-3">
          <Notice tone="violet" icon={<ShieldCheck className="h-4 w-4" />}>
            {lang === "kn"
              ? "Gmail ನಲ್ಲಿ ಲಾಗಿನ್ ಆಗುವಾಗ ನಿಮ್ಮ ವಿವರಗಳು Google ಜೊತೆಗೇ ಉಳಿಯುತ್ತವೆ. AI HUB ಯಾವುದೇ ಪಾಸ್‌ವರ್ಡ್ ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ."
              : "Your Google sign-in stays with Google. AI HUB does not store your password or read your inbox."}
          </Notice>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-hair bg-white/[0.02] p-3">
          <Mail className="h-4 w-4 text-red-300" />
          <p className="flex-1 text-[9.5px] text-muted-app">{t("openInNewTab")}</p>
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-app" />
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-hair p-3">
          <Wand2 className="h-4 w-4 text-violet-300" />
          <p className="text-[9.5px] text-muted-app">
            {lang === "kn" ? "Gmail API ಸಂಪರ್ಕವು ಸುರಕ್ಷಿತ ಬ್ಯಾಕೆಂಡ್ ಮೂಲಕ ಮಾತ್ರ." : "Gmail API access belongs on a secure backend with OAuth."}
          </p>
        </div>
      </div>
    </div>
  );
}
