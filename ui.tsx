import { useEffect, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ChevronRight, Copy, Eye, EyeOff, Plus, X } from "lucide-react";
import { cn } from "../utils/cn";
import { useApp } from "../store";
import type { DictKey } from "../i18n";
import { BrandIcon } from "./Brand";
import type { IconName } from "../data";

export function ScreenHeader({
  title,
  subtitle,
  right,
  accent = "#8b5cf6",
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  accent?: string;
}) {
  const { goBack, t } = useApp();
  return (
    <div className="flex items-start gap-3 px-5 pt-3 pb-4">
      <button
        type="button"
        onClick={goBack}
        aria-label={t("back")}
        className="press mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-app hover:bg-white/[0.08]"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span className="text-[9.5px] font-bold tracking-[0.18em] text-muted-app uppercase">AI HUB</span>
        </div>
        <h1 className="font-display text-[21px] leading-tight font-bold tracking-tight text-app">{title}</h1>
        {subtitle && <p className="mt-1 text-[11.5px] leading-relaxed text-muted-app">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

export const Btn = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "soft" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}) => (
  <button
    {...props}
    className={cn(
      "press inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-45",
      size === "sm" && "px-3 py-1.5 text-[11px]",
      size === "md" && "px-4 py-2.5 text-[12px]",
      size === "lg" && "w-full px-5 py-3.5 text-[13px]",
      size === "icon" && "h-9 w-9",
      variant === "primary" &&
        "neon-gradient text-white shadow-[0_10px_26px_-10px_rgba(168,85,247,.85)] hover:brightness-110",
      variant === "soft" && "bg-violet-500/14 text-violet-700 hover:bg-violet-500/22 dark:text-violet-300",
      variant === "ghost" && "text-soft hover:bg-white/[0.06]",
      variant === "outline" && "border border-hair bg-white/[0.03] text-soft hover:bg-white/[0.07]",
      variant === "danger" && "bg-rose-500/12 text-rose-400 hover:bg-rose-500/20",
      className,
    )}
  >
    {children}
  </button>
);

export function IconBtn({
  label,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...props}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "press flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-hair bg-white/[0.035] text-soft transition hover:bg-white/[0.08]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SectionHead({
  title,
  icon,
  accent,
  onViewAll,
  count,
}: {
  title: string;
  icon: IconName;
  accent: string;
  onViewAll?: () => void;
  count?: number;
}) {
  const { t } = useApp();
  return (
    <div className="mb-2.5 flex items-center justify-between gap-2 px-5">
      <div className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-lg"
          style={{ background: `${accent}22`, border: `1px solid ${accent}33` }}
        >
          <BrandIcon icon={icon} size={15} bare />
        </span>
        <h2 className="font-display text-[12.5px] font-bold tracking-wide text-app">{title}</h2>
        {typeof count === "number" && (
          <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-bold text-muted-app">
            {count}
          </span>
        )}
      </div>
      {onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          className="press flex items-center gap-0.5 rounded-full border border-hair bg-white/[0.03] px-2 py-1 text-[9.5px] font-bold text-soft hover:bg-white/[0.07]"
        >
          {t("viewAll")}
          <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export function ServiceTile({
  icon,
  name,
  sub,
  onClick,
  accent,
  badge,
  badgeLabel,
}: {
  icon: IconName;
  name: string;
  sub?: string;
  onClick: () => void;
  accent?: string;
  badge?: "official" | "independent" | "no-key";
  badgeLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press group relative flex w-[82px] shrink-0 flex-col items-center gap-1.5 rounded-2xl border border-hair bg-[var(--surface)] px-1.5 pt-3 pb-2.5 text-center shadow-[0_8px_22px_-16px_rgba(0,0,0,.9)] hover:-translate-y-0.5 hover:border-white/20"
    >
      {badge && (
        <span
          className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full"
          style={{
            background: badge === "no-key" ? "#34d399" : badge === "independent" ? "#fbbf24" : (accent ?? "#a78bfa"),
            boxShadow: `0 0 7px ${badge === "no-key" ? "#34d399" : "#a78bfa"}`,
          }}
        />
      )}
      <BrandIcon icon={icon} size={38} />
      <span className="mt-0.5 line-clamp-1 text-[10.5px] font-bold text-app">{name}</span>
      <span className="line-clamp-1 text-[8.5px] font-medium text-muted-app">{badgeLabel ?? sub}</span>
    </button>
  );
}

export function Field({
  label,
  hint,
  className,
  as = "input",
  ...props
}: {
  label?: string;
  hint?: string;
  as?: "input" | "textarea";
} & InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const Tag = as === "textarea" ? "textarea" : "input";
  const rest = props as unknown as Record<string, unknown>;
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-[10.5px] font-bold tracking-wide text-soft">{label}</span>}
      <Tag
        {...rest}
        className={cn(
          "field w-full rounded-xl px-3.5 py-2.5 text-[12px] transition",
          as === "textarea" && "min-h-[92px] resize-none leading-relaxed",
          className,
        )}
      />
      {hint && <span className="mt-1.5 block text-[10px] leading-relaxed text-muted-app">{hint}</span>}
    </label>
  );
}

export function SecretField({
  value,
  onChange,
  placeholder,
  visible,
  onToggleVisible,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  visible: boolean;
  onToggleVisible: () => void;
}) {
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        className="field w-full rounded-xl py-2.5 pr-10 pl-3.5 font-mono text-[12px] tracking-wide"
      />
      <button
        type="button"
        onClick={onToggleVisible}
        className="press absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted-app hover:bg-white/10 hover:text-soft"
        aria-label={visible ? "Hide" : "Show"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors duration-200",
        checked ? "bg-gradient-to-r from-violet-500 to-fuchsia-500" : "bg-white/15",
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-all duration-200",
          checked ? "left-[19px]" : "left-[3px]",
        )}
      />
    </button>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { t } = useApp();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const target = typeof document !== "undefined" ? document.getElementById("aihub-overlay") : null;
  const content = (
    <div className="pointer-events-auto absolute inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="absolute inset-0 bg-[#03050c]/70 backdrop-blur-[3px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="screen-in relative w-full rounded-t-[26px] border-t border-hair bg-[var(--surface)] px-5 pt-3 pb-[calc(18px+env(safe-area-inset-bottom))] shadow-[0_-24px_60px_-20px_rgba(0,0,0,.8)] lg:max-w-[392px] lg:rounded-[30px] lg:border lg:pb-5"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-[16px] font-bold text-app">{title}</h3>
          <IconBtn label={t("close")} onClick={onClose}>
            <X className="h-4 w-4" />
          </IconBtn>
        </div>
        <div className="max-h-[58vh] overflow-y-auto scroll-hide">{children}</div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
  if (!target) return content;
  return createPortal(content, target);
}

export function Notice({
  icon,
  children,
  tone = "violet",
}: {
  icon?: ReactNode;
  children: ReactNode;
  tone?: "violet" | "amber" | "green" | "sky";
}) {
  const tones = {
    violet: "border-violet-400/20 bg-violet-500/[0.08] text-violet-200/90",
    amber: "border-amber-400/20 bg-amber-400/[0.07] text-amber-100/90",
    green: "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-100/90",
    sky: "border-sky-400/20 bg-sky-400/[0.07] text-sky-100/90",
  };
  return (
    <div className={cn("flex gap-2.5 rounded-xl border px-3.5 py-3 text-[10.5px] leading-relaxed", tones[tone])}>
      {icon && <span className="mt-0.5 shrink-0 opacity-90">{icon}</span>}
      <div>{children}</div>
    </div>
  );
}

export function KeyPill({ configured, label }: { configured: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8.5px] font-bold whitespace-nowrap",
        configured
          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
          : "border-white/10 bg-white/[0.04] text-muted-app",
      )}
    >
      <span className={cn("h-1 w-1 rounded-full", configured ? "bg-emerald-400" : "bg-slate-500")} />
      {label}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-hair px-6 py-9 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">{icon}</div>
      <p className="font-display text-[13px] font-bold text-app">{title}</p>
      {body && <p className="mt-1 max-w-[240px] text-[10.5px] leading-relaxed text-muted-app">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function MenuRow({
  icon,
  title,
  subtitle,
  onClick,
  right,
  danger,
  last,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  right?: ReactNode;
  danger?: boolean;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "press flex w-full items-center gap-3 px-3.5 py-3 text-left",
        !last && "border-b border-hair",
        danger ? "text-rose-400" : "text-app",
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border",
            danger ? "border-rose-400/15 bg-rose-400/10" : "border-white/10 bg-white/[0.045] text-soft",
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-[12px] font-bold", danger ? "text-rose-400" : "text-app")}>{title}</span>
        {subtitle && <span className="mt-0.5 block truncate text-[10px] text-muted-app">{subtitle}</span>}
      </span>
      {right ?? <ChevronRight className="h-4 w-4 shrink-0 text-muted-app" />}
    </button>
  );
}

export function Chip({
  active,
  children,
  onClick,
  color,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "press shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold transition",
        active ? "text-white" : "border-hair bg-white/[0.03] text-muted-app hover:text-soft",
      )}
      style={
        active
          ? {
              borderColor: "transparent",
              background: color
                ? `linear-gradient(120deg, ${color}, ${color}bb)`
                : "linear-gradient(120deg,#8b5cf6,#ec4899)",
              boxShadow: `0 6px 18px -8px ${color ?? "#a855f7"}`,
            }
          : undefined
      }
    >
      {children}
    </button>
  );
}

export function CopyButton({ text, label }: { text: string; label: string }) {
  const { copyText } = useApp();
  return (
    <IconBtn label={label} onClick={() => copyText(text)}>
      <Copy className="h-3.5 w-3.5" />
    </IconBtn>
  );
}

export function Stat({ value, label, accent = "#a78bfa" }: { value: string; label: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-hair bg-white/[0.025] px-2.5 py-2">
      <p className="font-display text-[15px] leading-none font-extrabold" style={{ color: accent }}>
        {value}
      </p>
      <p className="mt-1 text-[8.5px] leading-tight font-semibold text-muted-app">{label}</p>
    </div>
  );
}

export function useSecretVisibility(initial = false) {
  const [visible, setVisible] = useState(initial);
  return { visible, toggle: () => setVisible((v) => !v), setVisible };
}

export function tKey(key: DictKey): DictKey {
  return key;
}

export { Plus, Eye, EyeOff };
