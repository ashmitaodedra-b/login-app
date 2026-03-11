"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
  login:             { idle: "Sign In",        pending: "Signing in…"       },
  signup:            { idle: "Sign Up",         pending: "Creating account…" },
  "forgot-password": { idle: "Send Reset Link", pending: "Sending…"          },
  "reset-password":  { idle: "Update Password", pending: "Updating…"         },
};

export function AuthForm({ mode: forcedMode }: AuthFormProps) {
  const searchParams = useSearchParams();
  const error   = searchParams.get("error");
  const message = searchParams.get("message");
  const next    = searchParams.get("next");

  const modeParam = searchParams.get("mode") as Mode | null;
  const mode: Mode = forcedMode ?? modeParam ?? "login";

  const [isPending, startTransition]    = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

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

  const { title, subtitle }                        = HEADINGS[mode];
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
                <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
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
                  <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
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
                  <PasswordToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                </div>
              </div>
            </>
          )}

          {/* Primary submit — contained · primary · large · full-width */}
          <button type="submit" disabled={isPending} className="btn-contained-primary btn-lg w-full mt-1">
            {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />{pendingLabel}</> : idleLabel}
          </button>

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

function PasswordToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={show ? "Hide password" : "Show password"}
      aria-pressed={show}
      className="absolute right-3 top-1/2 -translate-y-1/2
                 p-1.5 rounded-button
                 text-ink-placeholder hover:text-ink-secondary
                 hover:bg-surface-muted active:bg-border
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus/30
                 transition-all"
    >
      {show
        ? <EyeOff className="h-4 w-4" />
        : <Eye    className="h-4 w-4" />
      }
    </button>
  );
}

