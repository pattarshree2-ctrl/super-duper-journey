import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import QRCode from "qrcode";
import {
  ArrowUpRight,
  BookmarkPlus,
  Camera,
  CameraOff,
  Check,
  Clipboard,
  Copy,
  Download,
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  FolderUp,
  Globe2,
  KeyRound,
  Link2,
  Loader2,
  QrCode,
  ScanLine,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Wifi,
  X,
} from "lucide-react";
import { useApp } from "../store";
import { Btn, Chip, Field, Notice, ScreenHeader, Sheet } from "../components/ui";
import { normalizeUrl, googleSearchUrl, bytesLabel, allTools } from "../data";
import { bmCategories, type BookmarkCategory } from "../i18n";
import { dataUrlToFile, downloadDataUrl, downloadFile, shareFiles } from "../utils/media";

/* ------------------------------ QR Scanner ------------------------------ */

export function QrScannerScreen() {
  const { t, lang, copyText, launch, pushToast } = useApp();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [starting, setStarting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [result, setResult] = useState("");
  const [manual, setManual] = useState("");

  const stopCamera = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  }, []);

  const startCamera = async () => {
    setStarting(true);
    setFailed(false);
    setResult("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setActive(true);
      timerRef.current = window.setInterval(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState < 2) return;
        const width = Math.min(video.videoWidth || 640, 720);
        const scale = width / (video.videoWidth || 640);
        const height = Math.round((video.videoHeight || 480) * scale);
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, width, height);
        const image = ctx.getImageData(0, 0, width, height);
        const code = jsQR(image.data, width, height, { inversionAttempts: "dontInvert" });
        if (code?.data) {
          stopCamera();
          setResult(code.data);
          pushToast(lang === "kn" ? "QR ಕೋಡ್ ಪತ್ತೆಯಾಗಿದೆ" : "QR code detected", "success");
        }
      }, 380);
    } catch {
      setFailed(true);
      setActive(false);
      setStarting(false);
      return;
    }
    setStarting(false);
  };

  useEffect(() => () => stopCamera(), [stopCamera]);

  const acceptManual = () => {
    const value = manual.trim();
    if (!value) {
      pushToast(lang === "kn" ? "ಕೋಡ್ ನಮೂದಿಸಿ" : "Enter a code first", "error");
      return;
    }
    stopCamera();
    setResult(value);
    setManual("");
  };

  const openResult = () => {
    const url = normalizeUrl(result);
    if (url) launch(url);
    else pushToast(lang === "kn" ? "ಇದು ಲಿಂಕ್ ಅಲ್ಲ" : "This result is not a web link", "info");
  };

  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("scannerTitle")} subtitle={t("scannerSub")} accent="#38bdf8" />
      <div className="px-5">
        {result ? (
          <div className="overflow-hidden rounded-2xl border border-emerald-400/25 bg-[var(--surface)]">
            <div className="flex items-center gap-2 border-b border-hair bg-emerald-400/[0.07] px-3.5 py-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="text-[10.5px] font-extrabold text-emerald-300">{t("result")}</span>
              <span className="ml-auto text-[8px] font-semibold text-muted-app">QR_CODE</span>
            </div>
            <div className="p-3.5">
              <p className="max-h-[140px] overflow-y-auto break-all text-[11px] leading-relaxed font-medium text-app">{result}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Btn size="sm" onClick={() => copyText(result, t("copied"))}>
                  <Copy className="h-3 w-3" /> {t("copyResult")}
                </Btn>
                <Btn
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    try {
                      if (navigator.share) {
                        await navigator.share({ title: "AI HUB QR result", text: result });
                      } else {
                        copyText(result, t("copied"));
                      }
                    } catch {
                      copyText(result, t("copied"));
                    }
                  }}
                >
                  <Share2 className="h-3 w-3" /> {t("share")}
                </Btn>
                {normalizeUrl(result) && (
                  <Btn size="sm" variant="soft" className="col-span-2" onClick={openResult}>
                    <Link2 className="h-3 w-3" /> {t("openLink")}
                  </Btn>
                )}
              </div>
              <button
                type="button"
                onClick={() => setResult("")}
                className="press mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-hair py-2 text-[10px] font-bold text-violet-300"
              >
                <ScanLine className="h-3.5 w-3.5" /> {t("scanAgain")}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-[#04070f]">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
              <video ref={videoRef} playsInline muted className={`absolute inset-0 h-full w-full object-cover ${active ? "opacity-100" : "opacity-0"}`} />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,5,14,.6)_100%)]" />
              {!active && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                  <span className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${failed ? "border-rose-400/30 bg-rose-500/10 text-rose-300" : "border-sky-400/25 bg-sky-400/10 text-sky-300"}`}>
                    {failed ? <CameraOff className="h-7 w-7" /> : <QrCode className="h-7 w-7" />}
                  </span>
                  <p className="font-display text-[13px] font-extrabold text-white">{failed ? t("cameraDenied") : t("cameraOff")}</p>
                  <p className="max-w-[240px] text-[9.5px] leading-relaxed text-white/55">{failed ? t("cameraDeniedHint") : t("cameraHint")}</p>
                  {starting && <Loader2 className="mt-1 h-4 w-4 animate-spin text-sky-300" />}
                </div>
              )}
              {/* viewfinder corners */}
              <div className="pointer-events-none absolute inset-[14%] rounded-2xl">
                {[
                  "top-0 left-0 border-t-2 border-l-2 rounded-tl-xl",
                  "top-0 right-0 border-t-2 border-r-2 rounded-tr-xl",
                  "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl",
                  "bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl",
                ].map((cls) => (
                  <span key={cls} className={`absolute h-7 w-7 border-sky-300/90 ${cls}`} style={{ filter: "drop-shadow(0 0 5px rgba(56,189,248,.9))" }} />
                ))}
                {active && (
                  <span className="scan-beam absolute inset-x-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-sky-300 to-transparent shadow-[0_0_12px_rgba(56,189,248,.9)]" />
                )}
              </div>
              {active && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-2 py-1 backdrop-blur">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[8px] font-bold tracking-wide text-white/90 uppercase">{t("scanning")}</span>
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              {active ? (
                <Btn size="lg" variant="outline" onClick={stopCamera}>
                  <CameraOff className="h-3.5 w-3.5" /> {t("stop")}
                </Btn>
              ) : (
                <Btn size="lg" onClick={startCamera} disabled={starting}>
                  {starting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
                  {starting ? t("scanning") : t("enableCamera")}
                </Btn>
              )}
            </div>

            <div className="mt-3 rounded-2xl border border-hair bg-[var(--surface)] p-3.5">
              <p className="mb-2 text-[10px] font-bold text-soft">{t("manualEntry")}</p>
              <div className="flex gap-2">
                <input
                  value={manual}
                  onChange={(e) => setManual(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && acceptManual()}
                  placeholder="https://…"
                  className="field min-w-0 flex-1 rounded-xl px-3 py-2.5 text-[11px]"
                />
                <Btn size="sm" onClick={acceptManual}>
                  {t("add")}
                </Btn>
              </div>
            </div>
            <Notice tone="sky" icon={<ShieldCheck className="h-4 w-4" />}>{t("cameraHint")}</Notice>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ QR Generator ------------------------------ */

type QrKind = "url" | "text" | "email" | "phone" | "wifi";

export function QrGeneratorScreen() {
  const { t, lang, copyText, pushToast } = useApp();
  const [kind, setKind] = useState<QrKind>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [encryption, setEncryption] = useState("WPA");
  const [qr, setQr] = useState<{ dataUrl: string; payload: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const kinds: { id: QrKind; label: string; icon: React.ReactNode }[] = [
    { id: "url", label: t("url"), icon: <Globe2 className="h-3 w-3" /> },
    { id: "text", label: t("text"), icon: <FileText className="h-3 w-3" /> },
    { id: "email", label: t("email"), icon: <Send className="h-3 w-3" /> },
    { id: "phone", label: t("phone"), icon: <Camera className="h-3 w-3" /> },
    { id: "wifi", label: t("wifi"), icon: <Wifi className="h-3 w-3" /> },
  ];

  const buildPayload = (): string | null => {
    if (kind === "url") {
      if (!url.trim()) return null;
      return normalizeUrl(url) ?? url.trim();
    }
    if (kind === "text") return text.trim() || null;
    if (kind === "email") return email.trim() ? `mailto:${email.trim()}` : null;
    if (kind === "phone") return phone.trim() ? `tel:${phone.replace(/\s/g, "")}` : null;
    if (!ssid.trim()) return null;
    return `WIFI:T:${encryption === "nopass" ? "nopass" : encryption};S:${ssid.replace(/([\\;,":])/g, "\\$1")};${
      encryption === "nopass" ? "" : `P:${wifiPass.replace(/([\\;,":])/g, "\\$1")};`
    };`;
  };

  const generate = async () => {
    const payload = buildPayload();
    if (!payload) {
      pushToast(t("qrEmpty"), "error");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await QRCode.toDataURL(payload, {
        width: 720,
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: "#0c1024", light: "#ffffff" },
      });
      setQr({ dataUrl, payload });
      pushToast(lang === "kn" ? "QR ಕೋಡ್ ಸಿದ್ಧ" : "QR code ready", "success");
    } catch {
      pushToast(lang === "kn" ? "QR ರಚನೆ ವಿಫಲವಾಗಿದೆ" : "Could not create the QR code", "error");
    } finally {
      setBusy(false);
    }
  };

  const shareQr = async () => {
    if (!qr) return;
    const file = await dataUrlToFile(qr.dataUrl, "ai-hub-qr.png");
    if (file) {
      const ok = await shareFiles([file]);
      if (ok) return;
    }
    copyText(qr.payload, t("copied"));
  };

  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("qrGenTitle")} subtitle={t("qrGenSub")} accent="#a78bfa" />
      <div className="px-5">
        <div className="scroll-hide -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {kinds.map((k) => (
            <Chip key={k.id} active={kind === k.id} onClick={() => { setKind(k.id); setQr(null); }}>
              <span className="flex items-center gap-1">{k.icon}{k.label}</span>
            </Chip>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border border-hair bg-[var(--surface)] p-3.5">
          {kind === "url" && (
            <Field label={t("websiteUrl")} placeholder="https://arena.ai/" value={url} onChange={(e) => setUrl(e.target.value)} inputMode="url" />
          )}
          {kind === "text" && (
            <Field as="textarea" label={t("text")} placeholder={lang === "kn" ? "ನಿಮ್ಮ ಸಂದೇಶ…" : "Your message…"} value={text} onChange={(e) => setText(e.target.value)} />
          )}
          {kind === "email" && (
            <Field label={t("email")} placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" />
          )}
          {kind === "phone" && (
            <Field label={t("phone")} placeholder="+91 90000 00000" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
          )}
          {kind === "wifi" && (
            <div className="space-y-2.5">
              <Field label={t("networkName")} placeholder="Home Wi-Fi" value={ssid} onChange={(e) => setSsid(e.target.value)} />
              <Field label={t("password")} type="password" placeholder="••••••••" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} />
              <label className="block">
                <span className="mb-1.5 block text-[10.5px] font-bold text-soft">{t("encryption")}</span>
                <select value={encryption} onChange={(e) => setEncryption(e.target.value)} className="field w-full rounded-xl px-2.5 py-2.5 text-[11px]">
                  <option value="WPA">WPA / WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Open network</option>
                </select>
              </label>
            </div>
          )}
          <Btn size="lg" className="mt-3" onClick={generate} disabled={busy}>
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <QrCode className="h-3.5 w-3.5" />}
            {t("generateQr")}
          </Btn>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-hair bg-[linear-gradient(150deg,rgba(167,139,250,.12),var(--surface))]">
          <div className="flex items-center justify-between border-b border-hair px-3 py-2">
            <span className="flex items-center gap-1.5 text-[9.5px] font-bold text-muted-app">
              <QrCode className="h-3 w-3 text-violet-300" /> {t("livePreview")}
            </span>
            {qr && <span className="text-[8px] font-bold text-emerald-300">PNG · 720px</span>}
          </div>
          <div className="p-4">
            {qr ? (
              <div className="flex flex-col items-center">
                <div className="relative rounded-2xl bg-white p-3 shadow-[0_16px_40px_-16px_rgba(0,0,0,.7)]">
                  <img src={qr.dataUrl} alt="Generated QR code" className="h-[172px] w-[172px]" />
                  <span className="absolute inset-0 rounded-2xl ring-1 ring-black/5 ring-inset" />
                </div>
                <p className="mt-2 max-w-full truncate font-mono text-[8.5px] text-muted-app">{qr.payload}</p>
                <div className="mt-3 grid w-full grid-cols-2 gap-2">
                  <Btn size="sm" onClick={() => downloadDataUrl(qr.dataUrl, "ai-hub-qr.png")}>
                    <Download className="h-3 w-3" /> {t("downloadPng")}
                  </Btn>
                  <Btn size="sm" variant="outline" onClick={shareQr}>
                    <Share2 className="h-3 w-3" /> {t("shareQr")}
                  </Btn>
                  <Btn size="sm" variant="soft" className="col-span-2" onClick={() => copyText(qr.payload, t("copied"))}>
                    <Copy className="h-3 w-3" /> {t("copy")}
                  </Btn>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="relative flex h-[124px] w-[124px] items-center justify-center rounded-2xl border border-dashed border-violet-300/30 bg-white/[0.03]">
                  <QrCode className="h-10 w-10 text-violet-300/70" />
                  <span className="absolute -top-1 -left-1 h-4 w-4 rounded-tl-lg border-t-2 border-l-2 border-violet-300/60" />
                  <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-br-lg border-r-2 border-b-2 border-violet-300/60" />
                </div>
                <p className="mt-3 max-w-[220px] text-[9.5px] leading-relaxed text-muted-app">{t("qrEmpty")}</p>
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-[8.5px] text-muted-app">
          {lang === "kn" ? "ಕೋಡ್ ಸಾಧನದಲ್ಲೇ ರಚನೆಯಾಗುತ್ತದೆ · ಯಾವುದೇ ಡೇಟಾ ಅಪ್‌ಲೋಡ್ ಆಗುವುದಿಲ್ಲ" : "Generated on your device · nothing is uploaded"}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ File transfer ------------------------------ */

interface PickedFile {
  id: string;
  file: File;
}

function fileVisual(file: File) {
  if (file.type.startsWith("image/")) return { icon: <FileImage className="h-4 w-4" />, color: "#f472b6" };
  if (file.type.startsWith("video/")) return { icon: <FileVideo className="h-4 w-4" />, color: "#818cf8" };
  if (file.type.startsWith("audio/")) return { icon: <FileAudio className="h-4 w-4" />, color: "#fbbf24" };
  if (file.type.includes("zip") || file.type.includes("compressed")) return { icon: <FileArchive className="h-4 w-4" />, color: "#f59e0b" };
  if (file.type.includes("pdf") || file.type.startsWith("text/")) return { icon: <FileText className="h-4 w-4" />, color: "#34d399" };
  return { icon: <FileIcon className="h-4 w-4" />, color: "#94a3b8" };
}

function FileRow({
  entry,
  onRemove,
  onShare,
  onDownload,
  shareLabel,
  label,
}: {
  entry: PickedFile;
  onRemove: () => void;
  onShare: () => void;
  onDownload: () => void;
  shareLabel: string;
  label: string;
}) {
  const visual = fileVisual(entry.file);
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-hair bg-white/[0.02] p-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10" style={{ background: `${visual.color}18`, color: visual.color }}>
        {visual.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10.5px] font-bold text-app">{entry.file.name}</p>
        <p className="mt-0.5 text-[8.5px] text-muted-app">{bytesLabel(entry.file.size)}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button type="button" onClick={onShare} aria-label={shareLabel} className="press flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/12 text-violet-300">
          <Share2 className="h-3 w-3" />
        </button>
        <button type="button" onClick={onDownload} aria-label={label} className="press flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-300">
          <Download className="h-3 w-3" />
        </button>
        <button type="button" onClick={onRemove} aria-label="Remove file" className="press flex h-7 w-7 items-center justify-center rounded-md bg-rose-400/10 text-rose-300">
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function DropZone({
  onFiles,
  label,
  hint,
  icon,
}: {
  onFiles: (files: FileList | null) => void;
  label: string;
  hint: string;
  icon: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        onFiles(e.dataTransfer.files);
      }}
      className={`flex flex-col items-center rounded-2xl border-2 border-dashed p-5 text-center transition ${
        dragging ? "border-violet-400/70 bg-violet-500/10" : "border-hair bg-white/[0.02]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/12 text-violet-300">{icon}</span>
      <p className="font-display text-[12px] font-bold text-app">{label}</p>
      <p className="mt-1 max-w-[230px] text-[9px] leading-relaxed text-muted-app">{hint}</p>
      <Btn size="sm" variant="soft" className="mt-3" onClick={() => inputRef.current?.click()}>
        <FolderUp className="h-3 w-3" /> {label}
      </Btn>
    </div>
  );
}

export function FileTransferScreen() {
  const { t, lang, pushToast } = useApp();
  const [tab, setTab] = useState<"send" | "receive">("send");
  const [sendFiles, setSendFiles] = useState<PickedFile[]>([]);
  const [receivedFiles, setReceivedFiles] = useState<PickedFile[]>([]);
  const [dragHint, setDragHint] = useState(false);

  const addTo = (list: FileList | null, mode: "send" | "receive") => {
    if (!list || !list.length) return;
    const mapped = Array.from(list).map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
      file,
    }));
    if (mode === "send") setSendFiles((prev) => [...prev, ...mapped]);
    else setReceivedFiles((prev) => [...prev, ...mapped]);
  };

  const handleShare = async (files: PickedFile[]) => {
    setDragHint(false);
    const raw = files.map((f) => f.file);
    const ok = await shareFiles(raw);
    if (!ok) {
      if (raw[0]) downloadFile(raw[0]);
      pushToast(t("shareUnsupported"), "info");
    }
  };

  const activeFiles = tab === "send" ? sendFiles : receivedFiles;
  const removeFile = (id: string) => {
    if (tab === "send") setSendFiles((prev) => prev.filter((f) => f.id !== id));
    else setReceivedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("filesTitle")} subtitle={t("filesSub")} accent="#f59e0b" />
      <div className="px-5">
        <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl border border-hair bg-white/[0.03] p-1">
          {(["send", "receive"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTab(mode)}
              className={`press flex items-center justify-center gap-1.5 rounded-lg py-2 text-[10.5px] font-bold transition ${
                tab === mode ? "neon-gradient text-white shadow" : "text-muted-app"
              }`}
            >
              {mode === "send" ? <Send className="h-3 w-3" /> : <Download className="h-3 w-3" />}
              {mode === "send" ? t("send") : t("receive")}
            </button>
          ))}
        </div>

        <DropZone
          onFiles={(files) => addTo(files, tab)}
          label={tab === "send" ? t("chooseFiles") : t("receiveDrop")}
          hint={tab === "send" ? `${t("noFilesHint")} · ${t("share")} / ${t("download")}` : t("receiveNote")}
          icon={tab === "send" ? <UploadCloud className="h-5 w-5" /> : <Download className="h-5 w-5" />}
        />

        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold text-soft">
              {tab === "send" ? t("addFiles") : t("receiveTitle")} · {activeFiles.length}
            </p>
            {activeFiles.length > 0 && (
              <button
                type="button"
                onClick={() => (tab === "send" ? setSendFiles([]) : setReceivedFiles([]))}
                className="text-[9px] font-bold text-rose-400"
              >
                {t("clear")}
              </button>
            )}
          </div>
          {activeFiles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-hair px-3 py-5 text-center">
              <p className="text-[10px] font-bold text-muted-app">{t("noFiles")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeFiles.map((entry) => (
                <FileRow
                  key={entry.id}
                  entry={entry}
                  shareLabel={t("share")}
                  label={t("download")}
                  onRemove={() => removeFile(entry.id)}
                  onShare={() => handleShare([entry])}
                  onDownload={() => {
                    const ok = downloadFile(entry.file);
                    pushToast(ok ? t("fileReady") : t("downloadNotSupported"), ok ? "success" : "error");
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {activeFiles.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Btn size="sm" onClick={() => handleShare(activeFiles)}>
              <Share2 className="h-3 w-3" /> {t("shareAll")}
            </Btn>
            <Btn
              size="sm"
              variant="outline"
              onClick={() => {
                activeFiles.forEach((entry) => downloadFile(entry.file));
                pushToast(t("fileReady"), "success");
              }}
            >
              <Download className="h-3 w-3" /> {t("downloadAll")}
            </Btn>
          </div>
        )}

        <div className="mt-3">
          <Notice tone="amber" icon={<ShieldCheck className="h-4 w-4" />}>{t("receiveNote")}</Notice>
        </div>

        {dragHint && <p className="mt-2 text-center text-[9px] text-muted-app">{t("dropFiles")}</p>}

        <div className="mt-4 space-y-2 rounded-2xl border border-hair bg-white/[0.02] p-3.5">
          <p className="font-display text-[11px] font-bold text-app">{t("filesQuick")}</p>
          {[
            lang === "kn" ? "ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ — Android file picker ಬಳಸಲಾಗುತ್ತದೆ." : "Pick a file — this uses your device's file picker.",
            lang === "kn" ? "Share ಬಳಸಿ ನಿಮ್ಮ ಮೆಚ್ಚಿನ ಆ್ಯಪ್‌ಗೆ ಕಳುಹಿಸಿ." : "Use Share to send it to any app on your device.",
            lang === "kn" ? "Download ಫೈಲ್ ಅನ್ನು ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಉಳಿಸುತ್ತದೆ." : "Download saves a private copy on your device.",
          ].map((line) => (
            <div key={line} className="flex items-start gap-2">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
              <p className="text-[9px] leading-relaxed text-muted-app">{line}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Website search ------------------------------ */

export function SearchScreen({ initialQuery = "" }: { initialQuery?: string }) {
  const { t, lang, launch, pushToast, addBookmark, navigate } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [recents, setRecents] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("aihub.recent.v1");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
    } catch {
      return [];
    }
  });
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  const [bmName, setBmName] = useState("");
  const [bmUrl, setBmUrl] = useState("");
  const [bmCat, setBmCat] = useState<BookmarkCategory>("others");

  const saveRecents = (next: string[]) => {
    setRecents(next);
    try {
      localStorage.setItem("aihub.recent.v1", JSON.stringify(next));
    } catch {
      /* noop */
    }
  };

  const pushRecent = (value: string) => {
    if (!value.trim()) return;
    saveRecents([value.trim(), ...recents.filter((r) => r !== value.trim())].slice(0, 8));
  };

  const direct = normalizeUrl(query);

  const searchWeb = () => {
    const value = query.trim();
    if (!value) {
      pushToast(lang === "kn" ? "ಹುಡುಕಲು ಏನಾದರೂ ಬರೆಯಿರಿ" : "Type something to search", "error");
      return;
    }
    pushRecent(value);
    const url = direct ?? googleSearchUrl(value);
    launch(url);
  };

  const openDirect = () => {
    const value = query.trim();
    if (!value) {
      pushToast(lang === "kn" ? "ವೆಬ್‌ಸೈಟ್ URL ನಮೂದಿಸಿ" : "Enter a website URL", "error");
      return;
    }
    const normalized = normalizeUrl(value);
    if (!normalized) {
      pushToast(t("urlRequired"), "error");
      return;
    }
    pushRecent(value);
    launch(normalized);
  };

  const openBookmark = () => {
    setBmUrl(direct ?? (query.startsWith("http") ? query : ""));
    setBmName("");
    setBmCat("others");
    setBookmarkOpen(true);
  };

  return (
    <div className="screen-in pb-4">
      <ScreenHeader title={t("searchTitle")} subtitle={t("searchSub")} accent="#34d399" />
      <div className="px-5">
        <div className="rounded-2xl border border-hair bg-[linear-gradient(150deg,rgba(52,211,153,.08),var(--surface))] p-3.5">
          <div className="flex items-center gap-2 rounded-xl border border-hair bg-white/[0.035] px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-emerald-300" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchWeb()}
              placeholder={t("searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent text-[11.5px] text-app outline-none placeholder:text-[var(--muted)]"
              autoFocus
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label={t("clear")} className="text-muted-app hover:text-soft">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <Btn size="sm" onClick={searchWeb}>
              <Search className="h-3 w-3" /> {t("searchWeb")}
            </Btn>
            <Btn size="sm" variant="outline" onClick={openDirect}>
              <ArrowUpRight className="h-3 w-3" /> {t("openUrl")}
            </Btn>
          </div>
          {direct && (
            <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] px-2 py-1.5">
              <Link2 className="h-3 w-3 shrink-0 text-emerald-300" />
              <p className="min-w-0 flex-1 truncate text-[8.5px] text-emerald-200/80">{direct}</p>
              <button type="button" onClick={openBookmark} className="text-[8px] font-bold text-emerald-300">
                {t("bookmarkThis")}
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <Btn variant="outline" size="sm" className="flex-1" onClick={openBookmark}>
            <BookmarkPlus className="h-3 w-3" /> {t("bookmarkTitle")}
          </Btn>
          <Btn variant="outline" size="sm" className="flex-1" onClick={() => navigate({ name: "bookmarks" })}>
            <Clipboard className="h-3 w-3" /> {t("bookmarks")}
          </Btn>
        </div>

        {recents.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-display text-[11px] font-bold text-app">{t("recent")}</p>
              <button type="button" onClick={() => saveRecents([])} className="text-[9px] font-bold text-muted-app hover:text-rose-400">
                {t("clearRecent")}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recents.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setQuery(r);
                    launch(normalizeUrl(r) ?? googleSearchUrl(r));
                  }}
                  className="press flex max-w-full items-center gap-1 rounded-full border border-hair bg-white/[0.03] px-2.5 py-1.5 text-[9.5px] font-semibold text-soft"
                >
                  <Globe2 className="h-2.5 w-2.5 shrink-0 text-emerald-300" />
                  <span className="max-w-[140px] truncate">{r}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <p className="mb-2 font-display text-[11px] font-bold text-app">{t("quickLinks")}</p>
          <div className="space-y-1.5">
            {[
              { name: "Google", url: "https://www.google.com/", icon: <Search className="h-3.5 w-3.5" />, color: "#38bdf8" },
              { name: "Arena AI", url: "https://arena.ai/", icon: <Sparkles className="h-3.5 w-3.5" />, color: "#a78bfa" },
              { name: "Gemini", url: "https://gemini.google.com/app", icon: <KeyRound className="h-3.5 w-3.5" />, color: "#8ab4f8" },
              { name: "Suno", url: "https://suno.com/", icon: <Sparkles className="h-3.5 w-3.5" />, color: "#fbbf24" },
            ].map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => launch(item.url)}
                className="press flex w-full items-center gap-2.5 rounded-xl border border-hair bg-[var(--surface)] px-3 py-2.5 text-left"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${item.color}18`, color: item.color }}>
                  {item.icon}
                </span>
                <span className="flex-1 text-[10.5px] font-bold text-app">{item.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-app" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <Notice tone="green" icon={<ShieldCheck className="h-4 w-4" />}>
            {lang === "kn"
              ? "ವೆಬ್ ಹುಡುಕಾಟಗಳು Google ನಲ್ಲಿ ತೆರೆಯುತ್ತವೆ. ನಿಮ್ಮ ಹುಡುಕಾಟ ಇತಿಹಾಸ ಈ ಸಾಧನದಲ್ಲಿ ಮಾತ್ರ ಉಳಿಯುತ್ತದೆ."
              : "Web searches open on Google. Your recent searches stay on this device and never reach our servers."}
          </Notice>
        </div>

        <div className="mt-4">
          <p className="mb-2 font-display text-[11px] font-bold text-app">{t("allTools")}</p>
          <div className="grid grid-cols-3 gap-1.5">
            {allTools.slice(0, 9).map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => {
                  if (tool.view.startsWith("tool:")) navigate({ name: "tool", tool: tool.view.replace("tool:", "") });
                  else if (tool.view === "bookmarks") navigate({ name: "bookmarks" });
                  else if (tool.view === "arena") navigate({ name: "arena" });
                  else if (tool.external) launch(tool.external);
                }}
                className="press truncate rounded-lg border border-hair bg-white/[0.03] px-2 py-2 text-[8.5px] font-bold text-soft"
              >
                {tool.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Sheet
        open={bookmarkOpen}
        onClose={() => setBookmarkOpen(false)}
        title={t("bookmarkTitle")}
        footer={
          <Btn
            size="lg"
            onClick={() => {
              if (!bmName.trim()) {
                pushToast(t("nameRequired"), "error");
                return;
              }
              const normalized = normalizeUrl(bmUrl);
              if (!normalized) {
                pushToast(t("urlRequired"), "error");
                return;
              }
              addBookmark({ name: bmName, url: normalized, category: bmCat });
              setBookmarkOpen(false);
              setBmName("");
            }}
          >
            <BookmarkPlus className="h-3.5 w-3.5" /> {t("saveBookmark")}
          </Btn>
        }
      >
        <div className="space-y-3">
          <Field label={t("name")} placeholder="Arena AI" value={bmName} onChange={(e) => setBmName(e.target.value)} />
          <Field label={t("websiteUrl")} placeholder="https://arena.ai/" value={bmUrl} onChange={(e) => setBmUrl(e.target.value)} />
          <div>
            <p className="mb-1.5 text-[10.5px] font-bold text-soft">{t("category")}</p>
            <div className="flex flex-wrap gap-1.5">
              {bmCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setBmCat(c.id)}
                  className={`rounded-full border px-2.5 py-1.5 text-[9.5px] font-bold ${
                    bmCat === c.id ? "border-transparent text-[#120c20]" : "border-hair text-muted-app"
                  }`}
                  style={bmCat === c.id ? { background: c.color } : undefined}
                >
                  {lang === "kn" ? c.kn : c.en}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
