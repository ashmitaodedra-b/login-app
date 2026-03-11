"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  const supabase = await createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // Must go through /auth/callback so the PKCE code is exchanged for a
    // session before the user reaches the reset-password form.
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  if (error) {
    redirect(`/login?mode=forgot-password&error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?mode=forgot-password&message=Check+your+email+for+a+password+reset+link");
}
