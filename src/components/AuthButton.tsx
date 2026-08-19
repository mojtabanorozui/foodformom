import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { User } from "../type";
import { AuthModal } from "./AuthModal";

interface AuthButtonProps {
  user: User | null;
  onLogin: (email: string, password: string) => Promise<string | null>;
  onSignup: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<string | null>;
  onLogout: () => void | Promise<void>;
  onAuthSuccess?: (mode: "login" | "signup") => void;
  authLoaded?: boolean;
}

export function AuthButton({
  user,
  onLogin,
  onSignup,
  onLogout,
  onAuthSuccess,
  authLoaded = true,
}: AuthButtonProps) {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  if (user) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/90 px-2.5 py-1.5 shadow-sm backdrop-blur-sm">
        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" title={t("authSignedIn")} />
        <span className="max-w-[120px] truncate text-xs font-bold text-emerald-800 sm:max-w-[160px]">
          {user.displayName}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="shrink-0 rounded-lg border border-emerald-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-espresso transition-all hover:border-warm hover:text-warm"
        >
          {t("authLogout")}
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="rounded-xl border border-warm/40 bg-white/80 px-3 py-1.5 text-xs font-semibold text-warm shadow-sm backdrop-blur-sm transition-all hover:border-warm hover:bg-white"
      >
        {t("authLoginSignup")}
      </button>
      {modalOpen && (
        <AuthModal
          onClose={() => setModalOpen(false)}
          onLogin={onLogin}
          onSignup={onSignup}
          onSuccess={onAuthSuccess}
          authLoaded={authLoaded}
        />
      )}
    </>
  );
}
