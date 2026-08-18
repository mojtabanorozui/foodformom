import type { MealCategory } from "../type";
import type { TranslationKey } from "../i18n/types";
import { useLanguage } from "../i18n/LanguageContext";

const categoryEmoji: Record<MealCategory, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  dessert: "🍰",
  appetizer: "🥗",
  soup: "🍲",
  snack: "🥖",
};

interface CategoryBadgeProps {
  category: MealCategory;
  className?: string;
}

export function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  const { t } = useLanguage();

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-espresso shadow-sm backdrop-blur-sm ${className}`}
    >
      {categoryEmoji[category]} {t(`cat_${category}` as TranslationKey)}
    </span>
  );
}
