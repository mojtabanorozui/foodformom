import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { TranslationKey } from "../i18n/types";

interface AuthModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<string | null>;
  onSignup: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<string | null>;
}

type AuthMode = "login" | "signup";

export function AuthModal({ onClose, onLogin, onSignup }: AuthModalProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorKey(null);
    setSubmitting(true);

    const err =
      mode === "login"
        ? await onLogin(email, password)
        : await onSignup(email, password, displayName);

    setSubmitting(false);

    if (err) {
      const knownKeys: TranslationKey[] = [
        "authErrorRequired",
        "authErrorPassword",
        "authErrorEmailTaken",
        "authErrorInvalid",
      ];
      setErrorKey(
        knownKeys.includes(err as TranslationKey)
          ? (err as TranslationKey)
          : "authErrorInvalid",
      );
    } else {
      onClose();
    }
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[400] overflow-y-auto bg-[#3d405b]/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto my-8 w-full max-w-md overflow-hidden rounded-3xl bg-cream shadow-2xl ring-1 ring-white/60"
      >
        <div className="bg-gradient-to-r from-warm to-sage px-6 py-5">
          <h2 className="font-display text-xl font-bold text-white">
            {mode === "login" ? t("authLoginTitle") : t("authSignupTitle")}
          </h2>
          <p className="mt-1 text-sm text-white/80">{t("authSubtitle")}</p>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex rounded-xl bg-white/70 p-1 ring-1 ring-[#e5ddd4]">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorKey(null);
              }}
              className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
                mode === "login"
                  ? "bg-warm text-white shadow-sm"
                  : "text-espresso/60"
              }`}
            >
              {t("authLogin")}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorKey(null);
              }}
              className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
                mode === "signup"
                  ? "bg-warm text-white shadow-sm"
                  : "text-espresso/60"
              }`}
            >
              {t("authSignup")}
            </button>
          </div>

          {mode === "signup" && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-espresso">
                {t("authDisplayName")}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("authDisplayNamePlaceholder")}
                className="w-full rounded-xl border border-[#e5ddd4] bg-white px-4 py-2.5 text-sm text-espresso outline-none focus:border-warm focus:ring-2 focus:ring-warm/20"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-espresso">
              {t("authEmail")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("authEmailPlaceholder")}
              className="w-full rounded-xl border border-[#e5ddd4] bg-white px-4 py-2.5 text-sm text-espresso outline-none focus:border-warm focus:ring-2 focus:ring-warm/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-espresso">
              {t("authPassword")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("authPasswordPlaceholder")}
              className="w-full rounded-xl border border-[#e5ddd4] bg-white px-4 py-2.5 text-sm text-espresso outline-none focus:border-warm focus:ring-2 focus:ring-warm/20"
            />
          </div>

          {errorKey && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 ring-1 ring-red-200">
              {t(errorKey)}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border-2 border-[#e5ddd4] bg-white px-4 py-3 text-sm font-semibold text-espresso"
            >
              {t("communityCancel")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-2xl bg-gradient-to-r from-warm to-sage px-4 py-3 text-sm font-bold text-white shadow-md disabled:opacity-60"
            >
              {mode === "login" ? t("authLogin") : t("authSignup")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
