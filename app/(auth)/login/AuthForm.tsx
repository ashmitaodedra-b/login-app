"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { loginAction, signupAction } from "./actions";
import { forgotPasswordAction } from "../forgot-password/actions";
import { resetPasswordAction } from "../reset-password/actions";

type Mode = "login" | "signup" | "forgot-password" | "reset-password";

interface AuthFormProps {
  /** Force a specific mode regardless of URL params (used by /reset-password page). */
  mode?: Mode;
}

const HEADINGS: Record<Mode, { title: string; subtitle: string }> = {
  login: { title: "Hello Again!", subtitle: "Welcome Back" },
  signup: { title: "Create Account", subtitle: "Join us today" },
  "forgot-password": { title: "Forgot Password?", subtitle: "We'll send you a reset link" },
  "reset-password": { title: "Reset Password", subtitle: "Choose a new password" },
};

const BUTTON_LABELS: Record<Mode, { idle: string; pending: string }> = {
  login: { idle: "Login", pending: "Logging in…" },
  signup: { idle: "Sign Up", pending: "Creating account…" },
  "forgot-password": { idle: "Send Reset Link", pending: "Sending…" },
  "reset-password": { idle: "Update Password", pending: "Updating…" },
};

export function AuthForm({ mode: forcedMode }: AuthFormProps) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");
  const next = searchParams.get("next");

  const modeParam = searchParams.get("mode") as Mode | null;
  const mode: Mode = forcedMode ?? modeParam ?? "login";

  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => {
      if (mode === "login") return loginAction(data);
      if (mode === "signup") return signupAction(data);
      if (mode === "forgot-password") return forgotPasswordAction(data);
      if (mode === "reset-password") return resetPasswordAction(data);
    });
  }

  const { title, subtitle } = HEADINGS[mode];
  const { idle: idleLabel, pending: pendingLabel } = BUTTON_LABELS[mode];

  return (
    <section className="flex flex-1 flex-col items-center justify-center bg-white px-8">
      <div className="w-full max-w-[307px]">
        {/* Heading */}
        <h2 className="font-bold text-[26px] text-[#333] leading-tight mb-1">{title}</h2>
        <p className="font-normal text-[18px] text-[#333] mb-10">{subtitle}</p>

        {/* Banners */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {decodeURIComponent(error)}
          </div>
        )}
        {message && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {decodeURIComponent(message)}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {next && <input type="hidden" name="next" value={next} />}

          {/* Full name — signup only */}
          {mode === "signup" && (
            <div className="flex items-center gap-3 bg-white border border-[#eee] rounded-[30px] px-[26px] py-[18px] w-full">
              <UserIcon />
              <input
                name="full_name"
                type="text"
                autoComplete="name"
                required
                placeholder="Full Name"
                className="flex-1 bg-transparent text-[14px] font-normal text-[#333] placeholder-[#33334d] placeholder-opacity-30 outline-none"
              />
            </div>
          )}

          {/* Email — all modes except reset-password */}
          {mode !== "reset-password" && (
            <div className="flex items-center gap-3 bg-white border border-[#eee] rounded-[30px] px-[26px] py-[18px] w-full">
              <MailIcon />
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email Address"
                className="flex-1 bg-transparent text-[14px] font-normal text-[#333] placeholder-[#33334d] placeholder-opacity-30 outline-none"
              />
            </div>
          )}

          {/* Password — login and signup */}
          {(mode === "login" || mode === "signup") && (
            <div className="flex items-center gap-3 bg-white border border-[#eee] rounded-[30px] px-[26px] py-[18px] w-full">
              <LockIcon />
              <input
                name="password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
                placeholder="Password"
                className="flex-1 bg-transparent text-[14px] font-normal text-[#333] placeholder-[#33334d] placeholder-opacity-30 outline-none"
              />
            </div>
          )}

          {/* New password + confirm — reset-password only */}
          {mode === "reset-password" && (
            <>
              <div className="flex items-center gap-3 bg-white border border-[#eee] rounded-[30px] px-[26px] py-[18px] w-full">
                <LockIcon />
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  placeholder="New Password"
                  className="flex-1 bg-transparent text-[14px] font-normal text-[#333] placeholder-[#33334d] placeholder-opacity-30 outline-none"
                />
              </div>
              <div className="flex items-center gap-3 bg-white border border-[#eee] rounded-[30px] px-[26px] py-[18px] w-full">
                <LockIcon />
                <input
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  placeholder="Confirm Password"
                  className="flex-1 bg-transparent text-[14px] font-normal text-[#333] placeholder-[#33334d] placeholder-opacity-30 outline-none"
                />
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#0575e6] text-white text-[14px] font-normal rounded-[30px] px-[26px] py-[18px] mt-2 hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Spinner />
                {pendingLabel}
              </>
            ) : (
              idleLabel
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-5 flex flex-col items-center gap-2 text-center">
          {mode === "login" && (
            <>
              <Link
                href="/login?mode=forgot-password"
                className="text-[14px] font-normal text-[#333] opacity-70 hover:opacity-100 transition-opacity"
              >
                Forgot Password?
              </Link>
              <p className="text-[14px] font-normal text-[#333] opacity-70">
                Don&apos;t have an account?{" "}
                <Link href="/login?mode=signup" className="text-[#0575e6] opacity-100 hover:underline">
                  Sign Up
                </Link>
              </p>
            </>
          )}

          {mode === "signup" && (
            <p className="text-[14px] font-normal text-[#333] opacity-70">
              Already have an account?{" "}
              <Link href="/login" className="text-[#0575e6] opacity-100 hover:underline">
                Login
              </Link>
            </p>
          )}

          {(mode === "forgot-password" || mode === "reset-password") && (
            <Link
              href="/login"
              className="text-[14px] font-normal text-[#333] opacity-70 hover:opacity-100 transition-opacity"
            >
              Back to Login
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Icons ───────────────────────────────────────────────────────── */

function UserIcon() {
  return (
    <svg
      className="h-6 w-6 flex-shrink-0 text-[#333] opacity-30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      className="h-6 w-6 flex-shrink-0 text-[#333] opacity-30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="h-6 w-6 flex-shrink-0 text-[#333] opacity-30"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm3 8V6a3 3 0 10-6 0v3h6zm-3 4a1.5 1.5 0 00-1 2.6V17a1 1 0 102 0v-1.4A1.5 1.5 0 0012 13z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
