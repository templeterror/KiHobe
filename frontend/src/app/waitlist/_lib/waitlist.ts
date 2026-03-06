export async function submitToWaitlist(email: string, honeypot: string): Promise<void> {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, website: honeypot }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Could not join waitlist. Try again.");
  }
}
