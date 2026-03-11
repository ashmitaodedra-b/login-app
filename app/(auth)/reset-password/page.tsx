import { Suspense } from "react";
import { BrandPanel } from "../login/BrandPanel";
import { AuthForm } from "../login/AuthForm";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex bg-white">
      <BrandPanel />
      <Suspense>
        <AuthForm mode="reset-password" />
      </Suspense>
    </main>
  );
}
