import { useId } from "react";
import { Bookmark, FolderUp, Image as ImageIcon, Mic, Music2, QrCode, ScanLine, Search, Clapperboard } from "lucide-react";
import type { IconName } from "../data";

export function LogoMark({ size = 44, className = "" }: { size?: number; className?: string }) {
  const raw = useId();
  const id = raw.replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 6px 18px rgba(139,92,246,.45))" }}
    >
      <defs>
        <linearGradient id={`letter${id}`} x1="10" y1="8" x2="62" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.38" stopColor="#818CF8" />
          <stop offset="0.68" stopColor="#C084FC" />
          <stop offset="0.86" stopColor="#F472B6" />
          <stop offset="1" stopColor="#FBBF24" />
        </linearGradient>
        <linearGradient id={`orbit${id}`} x1="2" y1="34" x2="70" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67E8F9" />
          <stop offset="0.45" stopColor="#A78BFA" />
          <stop offset="0.8" stopColor="#F472B6" />
          <stop offset="1" stopColor="#FCD34D" />
        </linearGradient>
        <radialGradient id={`glow${id}`} cx="50%" cy="50%" r="50%">
          <stop stopColor="#A855F7" stopOpacity="0.55" />
          <stop offset="1" stopColor="#A855F7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="36" cy="36" r="34" fill={`url(#glow${id})`} />
      <path
        d="M35.8 8.5 57 63h-10.3l-3.9-10.9H29.2L25.3 63H15L35.8 8.5Zm0 20L32.2 41.4h7.3l-3.7-12.9Z"
        fill={`url(#letter${id})`}
        fillRule="evenodd"
      />
      <ellipse
        cx="36"
        cy="41.5"
        rx="32"
        ry="12.5"
        transform="rotate(-22 36 41.5)"
        stroke={`url(#orbit${id})`}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path d="M62.5 13.5c.4 3 2 4.6 5 5-3 .4-4.6 2-5 5-.4-3-2-4.6-5-5 3-.4 4.6-2 5-5Z" fill="#E9D5FF" />
      <path d="M11 50c.3 2 1.3 3 3.3 3.3-2 .3-3 1.3-3.3 3.3-.3-2-1.3-3-3.3-3.3 2-.3 3-1.3 3.3-3.3Z" fill="#7DD3FC" />
    </svg>
  );
}

export function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={compact ? 34 : 42} />
      <div className="leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-[20px] font-extrabold tracking-tight text-app">AI</span>
          <span className="neon-text font-display text-[20px] font-extrabold tracking-tight">HUB</span>
        </div>
        {!compact && (
          <p className="mt-1 text-[9.5px] font-semibold tracking-[0.14em] text-muted-app uppercase">
            One workspace
          </p>
        )}
      </div>
    </div>
  );
}

function glyph(icon: IconName) {
  switch (icon) {
    case "gemini":
      return (
        <svg viewBox="0 0 24 24" className="h-[62%] w-[62%]">
          <defs>
            <linearGradient id="gemGrad" x1="2" y1="2" x2="22" y2="22">
              <stop stopColor="#4F9DFF" />
              <stop offset="0.5" stopColor="#8B7BFF" />
              <stop offset="1" stopColor="#E879F9" />
            </linearGradient>
          </defs>
          <path
            d="M12 1.8c.7 5.9 4.3 9.5 10.2 10.2-5.9.7-9.5 4.3-10.2 10.2C11.3 16.3 7.7 12.7 1.8 12 7.7 11.3 11.3 7.7 12 1.8Z"
            fill="url(#gemGrad)"
          />
        </svg>
      );
    case "chatgpt":
      return (
        <svg viewBox="0 0 32 32" className="h-[70%] w-[70%]" fill="none" stroke="white" strokeWidth="1.7">
          <ellipse cx="16" cy="16" rx="9.2" ry="4.1" />
          <ellipse cx="16" cy="16" rx="9.2" ry="4.1" transform="rotate(60 16 16)" />
          <ellipse cx="16" cy="16" rx="9.2" ry="4.1" transform="rotate(120 16 16)" />
          <circle cx="16" cy="16" r="2.1" fill="white" stroke="none" />
        </svg>
      );
    case "claude":
      return (
        <svg viewBox="0 0 24 24" className="h-[68%] w-[68%]" stroke="#E8A181" strokeWidth="1.9" strokeLinecap="round">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <line
              key={deg}
              x1="12"
              y1="12"
              x2={12 + 8 * Math.cos((deg * Math.PI) / 180)}
              y2={12 + 8 * Math.sin((deg * Math.PI) / 180)}
              strokeOpacity={i % 2 === 0 ? 1 : 0.55}
            />
          ))}
        </svg>
      );
    case "flow":
      return (
        <svg viewBox="0 0 32 32" className="h-[62%] w-[62%]" fill="none">
          <circle cx="16" cy="16" r="13" stroke="#38BDF8" strokeWidth="2.4" />
          <path d="M6 18c3.4-8 11.5-9.6 20-5.4" stroke="#93C5FD" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M9 23.5c3.1-5.3 8-7.3 14.2-5" stroke="#60A5FA" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="23.5" cy="10" r="2.4" fill="#67E8F9" />
        </svg>
      );
    case "arena":
      return (
        <svg viewBox="0 0 32 32" className="h-[74%] w-[74%]" fill="none">
          <defs>
            <linearGradient id="arenaGrad" x1="4" y1="3" x2="28" y2="29">
              <stop stopColor="#67E8F9" />
              <stop offset="0.55" stopColor="#C084FC" />
              <stop offset="1" stopColor="#F472B6" />
            </linearGradient>
          </defs>
          <path d="M16 3 26 29h-5.2l-1.7-4.7h-6.2L11.2 29H6L16 3Zm0 10.3-1.6 6.6h3.2L16 13.3Z" fill="url(#arenaGrad)" />
          <ellipse cx="16" cy="19" rx="14.5" ry="5.2" transform="rotate(-22 16 19)" stroke="#E9D5FF" strokeWidth="1.5" strokeOpacity="0.85" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className="h-[64%] w-[64%]" fill="white">
          <path d="M14.6 21v-7.2h2.5l.4-2.9h-2.9V9c0-.8.2-1.4 1.4-1.4h1.6V5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.2H9.2v2.9h2.5V21h2.9Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className="h-[62%] w-[62%]" fill="none" stroke="white" strokeWidth="1.8">
          <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.6" />
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="17.1" cy="6.9" r="1" fill="white" stroke="none" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className="h-[66%] w-[66%]" fill="none">
          <path
            d="M12 3.3a8.6 8.6 0 0 0-7.4 13l-1.1 4 4.1-1.1A8.6 8.6 0 1 0 12 3.3Z"
            fill="white"
            fillOpacity="0.16"
            stroke="white"
            strokeWidth="1.5"
          />
          <path
            d="M9 7.6c-.3-.6-.5-.6-.8-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.3 5 4.5 2.5 1 3 .8 3.5.7.5 0 1.6-.6 1.8-1.2.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.4l-2-1c-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5L9 7.6Z"
            fill="white"
          />
        </svg>
      );
    case "meta":
      return (
        <svg viewBox="0 0 24 24" className="h-[70%] w-[70%]" fill="none" strokeLinecap="round">
          <defs>
            <linearGradient id="metaGrad" x1="1" y1="4" x2="23" y2="20">
              <stop stopColor="#22D3EE" />
              <stop offset="0.5" stopColor="#60A5FA" />
              <stop offset="1" stopColor="#C084FC" />
            </linearGradient>
          </defs>
          <path
            d="M2.5 14.5c0-4 2-7 4.6-7 3.4 0 5.5 7 7.2 9.2 1 1.3 2.5 1 3.4-.4.8-1.2 1.3-2.8 1.3-4.4 0-2.2-1-3.9-2.6-3.9-2.4 0-4.4 3.7-6 6.8-1.3 2.6-3 3.5-4.6 2.7"
            stroke="url(#metaGrad)"
            strokeWidth="2.2"
          />
          <path
            d="M21.5 14.5c0-4-2-7-4.6-7-1.2 0-2.3.8-3.3 2.3"
            stroke="url(#metaGrad)"
            strokeWidth="2.2"
          />
        </svg>
      );
    case "gmail":
      return (
        <svg viewBox="0 0 24 24" className="h-[60%] w-[60%]">
          <path d="M4 7.5 12 13l8-5.5V18a1 1 0 0 1-1 1h-1.4V10.4L12 14.7l-5.6-4.3V19H5a1 1 0 0 1-1-1V7.5Z" fill="#EA4335" />
          <path d="M4 7.5V8l8 5.5L20 8V6.7c0-1.2-1.4-1.9-2.4-1.2L12 9.4 6.4 5.5C5.4 4.8 4 5.5 4 6.7v.8Z" fill="#EA4335" />
          <path d="M4 7.5 12 13V19H5a1 1 0 0 1-1-1V7.5Z" fill="#4285F4" opacity="0.9" />
          <path d="M20 7.5 12 13V19h7a1 1 0 0 0 1-1V7.5Z" fill="#34A853" opacity="0.9" />
        </svg>
      );
    case "image":
      return <ImageIcon className="h-[52%] w-[52%]" strokeWidth={1.8} />;
    case "video":
      return <Clapperboard className="h-[52%] w-[52%]" strokeWidth={1.8} />;
    case "music":
      return <Music2 className="h-[52%] w-[52%]" strokeWidth={1.8} />;
    case "voice":
      return <Mic className="h-[52%] w-[52%]" strokeWidth={1.8} />;
    case "qrscan":
      return <ScanLine className="h-[52%] w-[52%]" strokeWidth={1.9} />;
    case "qrgen":
      return <QrCode className="h-[52%] w-[52%]" strokeWidth={1.8} />;
    case "files":
      return <FolderUp className="h-[52%] w-[52%]" strokeWidth={1.8} />;
    case "search":
      return <Search className="h-[52%] w-[52%]" strokeWidth={2} />;
    case "bookmarks":
      return <Bookmark className="h-[52%] w-[52%]" strokeWidth={1.9} />;
    default:
      return <Search className="h-1/2 w-1/2" />;
  }
}

const tileStyles: Record<IconName, { background: string; color: string; border?: string }> = {
  gemini: { background: "linear-gradient(145deg,#141a35,#0b0f21)", color: "#fff" },
  chatgpt: { background: "linear-gradient(145deg,#1b2530,#0c1217)", color: "#fff" },
  claude: { background: "linear-gradient(145deg,#2c1e19,#191110)", color: "#fff" },
  flow: { background: "linear-gradient(145deg,#0d2740,#071420)", color: "#fff" },
  arena: { background: "linear-gradient(145deg,#27113f,#120a20)", color: "#fff" },
  facebook: { background: "#1877F2", color: "#fff" },
  instagram: { background: "linear-gradient(140deg,#F9CE34,#EE2A7B 48%,#6228D7)", color: "#fff" },
  whatsapp: { background: "linear-gradient(145deg,#25D366,#128C7E)", color: "#fff" },
  meta: { background: "linear-gradient(145deg,#121a35,#0a0f1f)", color: "#fff" },
  gmail: { background: "#ffffff", color: "#EA4335", border: "1px solid rgba(0,0,0,.06)" },
  image: { background: "rgba(244,114,182,.14)", color: "#F472B6" },
  video: { background: "rgba(129,140,248,.15)", color: "#A5B4FC" },
  music: { background: "rgba(251,191,36,.14)", color: "#FBBF24" },
  voice: { background: "rgba(52,211,153,.14)", color: "#34D399" },
  qrscan: { background: "rgba(56,189,248,.14)", color: "#38BDF8" },
  qrgen: { background: "rgba(167,139,250,.16)", color: "#A78BFA" },
  files: { background: "rgba(245,158,11,.14)", color: "#F59E0B" },
  search: { background: "rgba(52,211,153,.14)", color: "#34D399" },
  bookmarks: { background: "rgba(251,191,36,.14)", color: "#FBBF24" },
};

export function BrandIcon({ icon, size = 46, bare = false }: { icon: IconName; size?: number; bare?: boolean }) {
  const style = tileStyles[icon];
  if (bare) {
    return (
      <span className="inline-flex items-center justify-center" style={{ width: size, height: size, color: style.color }}>
        {glyph(icon)}
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_4px_14px_-6px_rgba(0,0,0,.6)]"
      style={{
        width: size,
        height: size,
        background: style.background,
        color: style.color,
        border: style.border ?? "1px solid rgba(255,255,255,.09)",
      }}
    >
      {glyph(icon)}
    </span>
  );
}
