import type { CategoryFilter, MealCategory } from "../type";
import type { TranslationKey } from "../i18n/types";
import { allCategories } from "../utils/foodHelpers";
import { useLanguage } from "../i18n/LanguageContext";

interface CategoryFilterBarProps {
  value: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
  counts: Record<string, number>;
}

const categoryIcons: Record<MealCategory | "all", string> = {
  all: "🍽️",
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  dessert: "🍰",
  appetizer: "🥗",
  soup: "🍲",
  snack: "🥖",
};

export function CategoryFilterBar({
  value,
  onChange,
  counts,
}: CategoryFilterBarProps) {
  const { t } = useLanguage();

  const items: CategoryFilter[] = ["all", ...allCategories];

  return (
    <div className="flex w-full gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((cat) => {
        const active = value === cat;
        const count = cat === "all" ? counts.all : (counts[cat] ?? 0);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              active
                ? "bg-warm text-white shadow-md"
                : "bg-white/80 text-espresso ring-1 ring-[#e5ddd4] hover:bg-white hover:ring-warm/40"
            }`}
          >
            <span>{categoryIcons[cat]}</span>
            <span>{t(`cat_${cat}` as TranslationKey)}</span>
            <span
              className={`rounded-full px-1.5 text-xs ${active ? "bg-white/25" : "bg-espresso/10"}`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
