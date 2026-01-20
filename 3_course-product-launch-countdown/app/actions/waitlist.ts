"use server";

import { createClient } from "@/lib/supabase/server";

export async function joinWaitlist(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;

  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address" };
  }

  const supabase = await createClient();

  // Check if email already exists
  const { data: existing } = await supabase
    .from("waitlist")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (existing) {
    return { success: false, error: "You're already on the waitlist!" };
  }

  const { error } = await supabase.from("waitlist").insert({
    email: email.toLowerCase(),
    name: name || null,
    source: "landing_page",
  });

  if (error) {
    console.error("Waitlist error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true, message: "You're on the list! Check your email for confirmation." };
}
