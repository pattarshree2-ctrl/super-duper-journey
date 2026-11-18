export async function downloadFromUrl(url: string, filename: string): Promise<boolean> {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) throw new Error("fetch failed");
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
    return true;
  } catch {
    try {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      return true;
    } catch {
      return false;
    }
  }
}

export function downloadFile(file: File): boolean {
  try {
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name || "ai-hub-file";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
    return true;
  } catch {
    return false;
  }
}

export async function shareFiles(files: File[]): Promise<boolean> {
  if (!files.length) return false;
  try {
    if (navigator.canShare?.({ files })) {
      await navigator.share({
        files,
        title: "Shared from AI HUB",
        text: "Sent with AI HUB",
      });
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export async function shareUrl(url: string, title = "AI HUB"): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share({ title, url, text: title });
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export async function shareText(text: string, title = "AI HUB"): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share({ title, text });
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function downloadDataUrl(dataUrl: string, filename: string): boolean {
  try {
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    return true;
  } catch {
    return false;
  }
}

export async function dataUrlToFile(dataUrl: string, filename: string): Promise<File | null> {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type || "image/png" });
  } catch {
    return null;
  }
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}
