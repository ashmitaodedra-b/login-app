"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { loginAction, signupAction } from "./actions";
import { forgotPasswordAction } from "../forgot-password/actions";
import { resetPasswordAction } from "../reset-password/actions";

type Mode = "login" | "signup" | "forgot-password" | "reset-password";

interface AuthFormProps {
  /** Force a specific mode regardless of URL params (used by /reset-password page). */
  mode?: Mode;
}

const HEADINGS: Record<Mode, { title: string; subtitle: string }> = {
  login: {
    title: "Welcome Back",
    subtitle: "Enter your email and password to access your account",
  },
  signup: {
    title: "Create Account",
    subtitle: "Fill in your details to get started",
  },
  "forgot-password": {
    title: "Forgot Password?",
    subtitle: "Enter your email and we'll send you a reset link",
  },
  "reset-password": {
    title: "Reset Password",
    subtitle: "Enter your new password below",
  },
};

const BUTTON_LABELS: Record<Mode, { idle: string; pending: string }> = {
  login:            { idle: "Sign In",          pending: "Signing in…"        },
  signup:           { idle: "Sign Up",           pending: "Creating account…"  },
  "forgot-password":{ idle: "Send Reset Link",   pending: "Sending…"           },
  "reset-password": { idle: "Update Password",   pending: "Updating…"          },
};

export function AuthForm({ mode: forcedMode }: AuthFormProps) {
  const searchParams = useSearchParams();
  const error   = searchParams.get("error");
  const message = searchParams.get("message");
  const next    = searchParams.get("next");

  const modeParam = searchParams.get("mode") as Mode | null;
  const mode: Mode = forcedMode ?? modeParam ?? "login";

  const [isPending, startTransition]       = useTransition();
  const [showPassword, setShowPassword]    = useState(false);
  const [showConfirm,  setShowConfirm]     = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => {
      if (mode === "login")           return loginAction(data);
      if (mode === "signup")          return signupAction(data);
      if (mode === "forgot-password") return forgotPasswordAction(data);
      if (mode === "reset-password")  return resetPasswordAction(data);
    });
  }

  const { title, subtitle }              = HEADINGS[mode];
  const { idle: idleLabel, pending: pendingLabel } = BUTTON_LABELS[mode];

  return (
    <section className="flex flex-1 flex-col items-center justify-center bg-surface px-8 py-12">
      <div className="w-full max-w-[420px]">

        {/* ── Heading ─────────────────────────────────── */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-display text-ink mb-2">{title}</h2>
          <p className="text-caption text-ink-muted leading-relaxed">{subtitle}</p>
        </div>

        {/* ── Status banners ──────────────────────────── */}
        {error   && <div className="ds-banner-error   mb-5">{decodeURIComponent(error)}</div>}
        {message && <div className="ds-banner-success mb-5">{decodeURIComponent(message)}</div>}

        {/* ── Form ────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {next && <input type="hidden" name="next" value={next} />}

          {/* Full name — signup only */}
          {mode === "signup" && (
            <div className="ds-field">
              <label className="ds-label">Full Name</label>
              <input
                name="full_name"
                type="text"
                autoComplete="name"
                required
                placeholder="Enter your full name"
                className="ds-input"
              />
            </div>
          )}

          {/* Email — all modes except reset-password */}
          {mode !== "reset-password" && (
            <div className="ds-field">
              <label className="ds-label">Email</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                className="ds-input"
              />
            </div>
          )}

          {/* Password — login and signup */}
          {(mode === "login" || mode === "signup") && (
            <div className="ds-field">
              <label className="ds-label">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  required
                  placeholder="Enter your password"
                  className="ds-input pr-12"
                />
                <ToggleBtn
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>
          )}

          {/* Remember me + Forgot Password — login only */}
          {mode === "login" && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-caption text-ink-secondary cursor-pointer select-none">
                <input type="checkbox" name="remember" className="w-4 h-4 rounded accent-ink" />
                Remember me
              </label>
              <Link
                href="/login?mode=forgot-password"
                className="text-caption text-ink-secondary hover:text-ink transition-colors"
              >
                Forgot Password
              </Link>
            </div>
          )}

          {/* New password + confirm — reset-password only */}
          {mode === "reset-password" && (
            <>
              <div className="ds-field">
                <label className="ds-label">New Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="Enter new password"
                    className="ds-input pr-12"
                  />
                  <ToggleBtn show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                </div>
              </div>
              <div className="ds-field">
                <label className="ds-label">Confirm Password</label>
                <div className="relative">
                  <input
                    name="confirm_password"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="Confirm new password"
                    className="ds-input pr-12"
                  />
                  <ToggleBtn show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                </div>
              </div>
            </>
          )}

          {/* Primary submit */}
          <button type="submit" disabled={isPending} className="ds-btn-primary mt-1">
            {isPending ? <><Spinner />{pendingLabel}</> : idleLabel}
          </button>

          {/* Google — login and signup only */}
          {(mode === "login" || mode === "signup") && (
            <button type="button" className="ds-btn-secondary">
              <GoogleIcon />
              Sign In with Google
            </button>
          )}
        </form>

        {/* ── Footer links ────────────────────────────── */}
        <div className="mt-8 text-center">
          {mode === "login" && (
            <p className="text-caption text-ink-muted">
              Don&apos;t have an account?{" "}
              <Link href="/login?mode=signup" className="font-semibold text-ink hover:underline">
                Sign Up
              </Link>
            </p>
          )}
          {mode === "signup" && (
            <p className="text-caption text-ink-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-ink hover:underline">
                Sign In
              </Link>
            </p>
          )}
          {(mode === "forgot-password" || mode === "reset-password") && (
            <Link href="/login" className="text-caption text-ink-muted hover:text-ink transition-colors">
              Back to Sign In
            </Link>
          )}
        </div>

      </div>
    </section>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

function ToggleBtn({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-placeholder hover:text-ink-secondary transition-colors"
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );
}

/* ── Icons ───────────────────────────────────────────────────────── */

function EyeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.42-4.072M6.53 6.53A9.955 9.955 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.054 10.054 0 01-4.07 5.47M6.53 6.53L3 3m3.53 3.53l11.94 11.94M9.88 9.88a3 3 0 104.24 4.24" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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
