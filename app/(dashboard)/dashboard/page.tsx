import { signOutAction } from "./actions";

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-subtle">
      <div className="text-center space-y-6">
        <h1 className="text-title text-ink">Dashboard</h1>
        <p className="text-base text-ink-muted">You are signed in.</p>
        <form action={signOutAction}>
          <button type="submit" className="ds-btn-brand px-8 py-3">
            Sign Out
          </button>
        </form>
      </div>
    </main>
  );
}
