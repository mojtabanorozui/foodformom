import type { AppTab } from "../type";
import type { TranslationKey } from "../i18n/types";
import { useLanguage } from "../i18n/LanguageContext";

interface TabNavProps {
  active: AppTab;
  onChange: (tab: AppTab) => void;
  favoriteCount: number;
  communityCount: number;
}

export function TabNav({ active, onChange, favoriteCount, communityCount }: TabNavProps) {
  const { t } = useLanguage();

  const tabs: { id: AppTab; icon: string; badge?: number }[] = [
    { id: "browse", icon: "📋" },
    { id: "spin", icon: "🎰" },
    { id: "favorites", icon: "❤️", badge: favoriteCount },
    { id: "community", icon: "👩‍🍳", badge: communityCount },
  ];

  return (
    <div className="flex w-full rounded-2xl bg-white/70 p-1.5 shadow-inner ring-1 ring-[#e5ddd4]">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
              isActive
                ? "bg-warm text-white shadow-md"
                : "text-espresso/60 hover:bg-white/80 hover:text-espresso"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{t(`tab_${tab.id}` as TranslationKey)}</span>
            {tab.badge != null && tab.badge > 0 && (
              <span
                className={`rounded-full px-1.5 text-xs ${isActive ? "bg-white/25" : "bg-warm/15 text-warm-dark"}`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
