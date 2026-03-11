import { Suspense } from "react";
import { BrandPanel } from "./BrandPanel";
import { AuthForm } from "./AuthForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex bg-white">
      <BrandPanel />
      <Suspense>
        <AuthForm />
      </Suspense>
    </main>
  );
}
