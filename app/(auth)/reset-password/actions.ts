"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm_password") as string;

  if (password !== confirm) {
    redirect(`/reset-password?error=${encodeURIComponent("Passwords do not match")}`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Password+updated+successfully.+Please+log+in.");
}
