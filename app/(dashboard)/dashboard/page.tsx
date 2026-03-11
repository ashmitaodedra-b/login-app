import { signOutAction } from "./actions";

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">You are signed in.</p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="bg-[#0575e6] text-white text-[14px] font-normal rounded-[30px] px-8 py-3 hover:bg-blue-600 active:bg-blue-700 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </main>
  );
}
