"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password`,
  });

  if (error) {
    redirect(`/login?mode=forgot-password&error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?mode=forgot-password&message=Check+your+email+for+a+password+reset+link");
}
