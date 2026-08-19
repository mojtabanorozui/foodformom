import { ALLERGEN_CONFIG } from "../data/allergens";
import { useLanguage } from "../i18n/LanguageContext";
import type { Allergen } from "../type";
import type { TranslationKey } from "../i18n/types";

interface AllergenBadgesProps {
  allergens: Allergen[];
  className?: string;
  compact?: boolean;
}

export function AllergenBadges({
  allergens,
  className = "",
  compact = false,
}: AllergenBadgesProps) {
  const { t } = useLanguage();

  if (allergens.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {allergens.map((allergen) => {
        const config = ALLERGEN_CONFIG[allergen];
        return (
          <span
            key={allergen}
            title={t(config.labelKey as TranslationKey)}
            className={`inline-flex items-center gap-1 rounded-full bg-amber-50 font-semibold text-amber-800 ring-1 ring-amber-200/80 ${
              compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
            }`}
          >
            <span>{config.icon}</span>
            {!compact && (
              <span>{t(config.labelKey as TranslationKey)}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
