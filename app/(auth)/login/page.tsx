import { BrandPanel } from "./BrandPanel";
import { AuthForm } from "./AuthForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex bg-white">
      <BrandPanel />
      <AuthForm />
    </main>
  );
}
