
 export type IconName =
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "meta"
  | "gemini"
  | "chatgpt"
  | "claude"
  | "flow"
  | "arena"
  | "gmail"
  | "image"
  | "video"
  | "music"
  | "voice"
  | "qrscan"
  | "qrgen"
  | "files"
  | "search"
  | "bookmarks";

export interface Service {
  id: string;
  name: string;
  sub: string;
  icon: IconName;
  url: string;
  action: "login" | "open" | "create";
  apiKey?: ApiKeyId;
  badge?: "official" | "independent" | "no-key";
  tint?: string;
}

export type ApiKeyId = "gemini" | "openai" | "claude" | "image" | "video" | "music" | "voice";

export interface ApiKeyDef {
  id: ApiKeyId;
  label: string;
  labelKn: string;
  provider: string;
  prefix: string;
  docs: string;
  note: string;
}

export const apiKeyDefs: ApiKeyDef[] = [
  {
    id: "gemini",
    label: "Gemini API Key",
    labelKn: "Gemini API ಕೀ",
    provider: "Google AI Studio",
    prefix: "AIza...",
    docs: "https://google.com",
    note: "For Gemini chat and multimodal generation through your backend.",
  },
  {
    id: "openai",
    label: "OpenAI API Key",
    labelKn: "OpenAI API ಕೀ",
    provider: "OpenAI Platform",
    prefix: "sk-...",
    docs: "https://openai.com",
    note: "For ChatGPT-style completions, images and audio through your backend.",
  },
  {
    id: "claude",
    label: "Claude API Key",
    labelKn: "Claude API ಕೀ",
    provider: "Anthropic Console",
    prefix: "sk-ant-...",
    docs: "https://anthropic.com",
    note: "For Claude model requests through your backend proxy.",
  },
  {
    id: "image",
    label: "AI Image API Key",
    labelKn: "AI ಚಿತ್ರ API ಕೀ",
    provider: "Your image provider",
    prefix: "Any provider key",
    docs: "https://openai.com",
    note: "Used by your backend to call the image model you choose.",
  },
  {
    id: "video",
    label: "AI Video API Key",
    labelKn: "AI ವಿಡಿಯೋ API ಕೀ",
    provider: "Your video provider",
    prefix: "Any provider key",
    docs: "https://runwayml.com",
    note: "Video generation is asynchronous — keep long-running jobs on the server.",
  },
  {
    id: "music",
    label: "AI Music API Key",
    labelKn: "AI ಸಂಗೀತ API ಕೀ",
    provider: "Your music provider",
    prefix: "Any provider key",
    docs: "https://suno.com",
    note: "Connect your licensed provider through a secure backend endpoint.",
  },
  {
    id: "voice",
    label: "AI Voice API Key",
    labelKn: "AI ಧ್ವನಿ API ಕೀ",
    provider: "Your voice provider",
    prefix: "Any provider key",
    docs: "https://elevenlabs.io",
    note: "For text-to-speech and voice cloning with explicit consent.",
  },
];

export const socialServices: Service[] = [
  { id: "meta-ai", name: "Meta AI", sub: "Assistant", icon: "meta", url: "https://meta.ai", action: "login", tint: "#6d8cff", badge: "official" },
  { id: "whatsapp", name: "WhatsApp", sub: "Messaging", icon: "whatsapp", url: "https://whatsapp.com", action: "login", tint: "#25d366", badge: "official" },
  { id: "facebook", name: "Facebook", sub: "Social", icon: "facebook", url: "https://www.facebook.com/", action: "login", tint: "#1877f2", badge: "official" },
  { id: "instagram", name: "Instagram", sub: "Social", icon: "instagram", url: "https://www.instagram.com/", action: "login", tint: "#e1306c", badge: "official" },
];

export const chatServices: Service[] = [
  { id: "gemini", name: "Gemini", sub: "Google", icon: "gemini", url: "https://google.com", action: "login", apiKey: "gemini", tint: "#8ab4f8", badge: "official" },
  { id: "chatgpt", name: "ChatGPT", sub: "OpenAI", icon: "chatgpt", url: "https://chatgpt.com", action: "login", apiKey: "openai", tint: "#10a37f", badge: "official" },
  { id: "claude", name: "Claude", sub: "Anthropic", icon: "claude", url: "https://claude.ai", action: "login", apiKey: "claude", tint: "#d97757", badge: "official" },
  { id: "flow", name: "Flow AI", sub: "AI platform", icon: "flow", url: "https://flow.ai", action: "login", tint: "#38bdf8", badge: "official" },
  { id: "arena", name: "Arena AI", sub: "Independent", icon: "arena", url: "https://arena.ai", action: "open", tint: "#a855f7", badge: "independent" },
];

export const ARENA_URL = "https://arena.ai";

export interface HomeSection {
  id: string;
  titleKey: string;
  accent: string;
  icon: "social" | "chat" | "create" | "utilities";
  services: Service[];
  hash: string;
}

export const homeSections: HomeSection[] = [
  { id: "social", titleKey: "aiSocialMedia", accent: "#8b5cf6", icon: "social", hash: "social", services: socialServices },
  { id: "chat", titleKey: "aiChat", accent: "#38bdf8", icon: "chat", hash: "chat", services: chatServices },
  {
    id: "creation",
    titleKey: "aiCreation",
    accent: "#f472b6",
    icon: "create",
    hash: "create",
    services: [
      { id: "image", name: "Image", sub: "Generate", icon: "image", url: "#tool/image", action: "create", apiKey: "image", tint: "#f472b6" },
      { id: "video", name: "Video", sub: "Generate", icon: "video", url: "#tool/video", action: "create", apiKey: "video", tint: "#818cf8" },
      { id: "music", name: "Music", sub: "Generate", icon: "music", url: "#tool/music", action: "create", apiKey: "music", tint: "#fbbf24" },
      { id: "voice", name: "Voice", sub: "Create", icon: "voice", url: "#tool/voice", action: "create", apiKey: "voice", tint: "#34d399" },
      { id: "gmail", name: "Gmail", sub: "Compose", icon: "gmail", url: "#tool/gmail", action: "login", tint: "#ea4335" },
    ],
  },
  {
    id: "utilities",
    titleKey: "smartTools",
    accent: "#fbbf24",
    icon: "utilities",
    hash: "smart",
    services: [
      { id: "qrscan", name: "QR Scan", sub: "Camera", icon: "qrscan", url: "#tool/qrscan", action: "open", tint: "#38bdf8", badge: "no-key" },
      { id: "qrgen", name: "QR Create", sub: "Share", icon: "qrgen", url: "#tool/qrgen", action: "create", tint: "#a78bfa", badge: "no-key" },
      { id: "files", name: "Files", sub: "Send & receive", icon: "files", url: "#tool/files", action: "open", tint: "#f59e0b", badge: "no-key" },
      { id: "search", name: "Web Search", sub: "Open any site", icon: "search", url: "#tool/search", action: "open", tint: "#34d399", badge: "no-key" },
      { id: "bookmarks", name: "Bookmarks", sub: "Saved links", icon: "bookmarks", url: "#bookmarks", action: "open", tint: "#fbbf24", badge: "no-key" },
    ],
  },
];

export interface ToolEntry {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  view: string;
  category: "AI Chat" | "AI Creation" | "Social" | "Utilities";
  tint: string;
  external?: string;
  apiKey?: ApiKeyId;
}

export const allTools: ToolEntry[] = [
  ...socialServices.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.sub,
    icon: s.icon,
    view: "external",
    category: "Social" as const,
    tint: s.tint ?? "#8b5cf6",
    external: s.url,
  })),
  ...chatServices.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.sub,
    icon: s.icon,
    view: s.id === "arena" ? "arena" : "external",
    category: "AI Chat" as const,
    tint: s.tint ?? "#8b5cf6",
    external: s.url,
    apiKey: s.apiKey,
  })),
  { id: "image", name: "AI Image Generator", description: "Prompt-to-image studio", icon: "image", view: "tool:image", category: "AI Creation", tint: "#f472b6", apiKey: "image" },
  { id: "video", name: "AI Video Generator", description: "Shot-ready prompt studio", icon: "video", view: "tool:video", category: "AI Creation", tint: "#818cf8", apiKey: "video" },
  { id: "music", name: "AI Music Generator", description: "Song brief builder", icon: "music", view: "tool:music", category: "AI Creation", tint: "#fbbf24", apiKey: "music" },
  { id: "voice", name: "AI Voice Creator", description: "Text-to-speech preview", icon: "voice", view: "tool:voice", category: "AI Creation", tint: "#34d399", apiKey: "voice" },
  { id: "gmail", name: "Gmail", description: "Official compose window", icon: "gmail", view: "tool:gmail", category: "Utilities", tint: "#ea4335" },
  { id: "qrscan", name: "QR Scanner", description: "Camera or manual", icon: "qrscan", view: "tool:qrscan", category: "Utilities", tint: "#38bdf8" },
  { id: "qrgen", name: "QR Code Generator", description: "URL, text, Wi-Fi", icon: "qrgen", view: "tool:qrgen", category: "Utilities", tint: "#a78bfa" },
  { id: "files", name: "File Send & Receive", description: "Share and download", icon: "files", view: "tool:files", category: "Utilities", tint: "#f59e0b" },
  { id: "search", name: "Website Search", description: "Google or direct URL", icon: "search", view: "tool:search", category: "Utilities", tint: "#34d399" },
  { id: "bookmarks", name: "Bookmarks", description: "Your saved links", icon: "bookmarks", view: "bookmarks", category: "Utilities", tint: "#fbbf24" },
];

export const imageStyles = ["Cinematic", "Neon", "Watercolour", "3D render", "Anime", "Minimal"];
export const imageRatios = ["1:1", "4:3", "16:9", "9:16"];

export const officialTools = {
  image: [
    { name: "Gemini image", url: "https://google.com", note: "Google's assistant" },
    { name: "Image Creator", url: "https://bing.com", note: "Microsoft Designer" },
    { name: "Ideogram", url: "https://ideogram.ai", note: "Typography-first art" },
    { name: "Leonardo AI", url: "https://leonardo.ai", note: "Production assets" },
  ],
  video: [
    { name: "Google Flow", url: "https://labs.google", note: "Google's film studio" },
    { name: "Runway", url: "https://runwayml.com", note: "Gen video suite" },
    { name: "Pika", url: "https://pika.art", note: "Fast social video" },
    { name: "Luma Dream Machine", url: "https://lumalabs.ai", note: "Cinematic motion" },
  ],
  music: [
    { name: "Suno", url: "https://suno.com", note: "Songs from prompts" },
 