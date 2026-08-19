import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { apiGetStats } from "../lib/api";

interface ConnectionBannerProps {
  apiReady: boolean;
  dbReady: boolean;
  loaded: boolean;
}

export function ConnectionBanner({ apiReady, dbReady, loaded }: ConnectionBannerProps) {
  const { t } = useLanguage();
  const [stats, setStats] = useState<{ users: number; recipes: number } | null>(null);

  useEffect(() => {
    if (!loaded || !apiReady || !dbReady) return;
    apiGetStats().then((data) => {
      if (data) setStats({ users: data.users, recipes: data.recipes });
    });
  }, [loaded, apiReady, dbReady]);

  if (!loaded) return null;

  if (apiReady && dbReady) {
    return (
      <div className="relative z-30 mx-4 mt-2 rounded-2xl bg-emerald-50 px-4 py-2.5 text-center text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200 sm:mx-6">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {t("connectedBanner")}
          {stats && (
            <span className="text-emerald-700/80">
              · {stats.users} {t("communityMembers")} · {stats.recipes} {t("communitySharedRecipes")}
            </span>
          )}
        </span>
      </div>
    );
  }

  const message = !apiReady ? t("offlineBanner") : t("dbNotConnectedBanner");

  return (
    <div className="relative z-30 mx-4 mt-2 rounded-2xl bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-800 ring-1 ring-amber-200 sm:mx-6">
      ⚠️ {message}
    </div>
  );
}
