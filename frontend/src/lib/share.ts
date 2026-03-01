export function shareWhatsApp(text: string, url: string): void {
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank");
}

export function shareMessenger(url: string): void {
  window.open(`fb-messenger://share?link=${encodeURIComponent(url)}`, "_blank");
}

export function shareTelegram(text: string, url: string): void {
  window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
}

export async function copyLink(url: string): Promise<void> {
  await navigator.clipboard.writeText(url);
}

export function getMarketUrl(predictionId: string): string {
  return `${window.location.origin}/prediction/${predictionId}`;
}

export function getReferralUrl(referralCode: string): string {
  return `${window.location.origin}?ref=${referralCode}`;
}
