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
}

export function AuthButton({ user, onLogin, onSignup, onLogout }: AuthButtonProps) {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-xs font-semibold text-espresso/70 sm:inline">
          {user.displayName}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-[#e5ddd4] bg-white/80 px-3 py-1.5 text-xs font-semibold text-espresso shadow-sm backdrop-blur-sm transition-all hover:border-warm hover:bg-white"
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
        />
      )}
    </>
  );
}
