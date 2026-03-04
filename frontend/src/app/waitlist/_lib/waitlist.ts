import { supabase } from "@/lib/supabase";

export async function submitToWaitlist(email: string): Promise<void> {
  const { error } = await supabase.from("waitlist").insert({ email });
  if (error?.code === "23505") throw new Error("Already on the list");
  if (error) throw new Error("Could not join waitlist. Try again.");
}
