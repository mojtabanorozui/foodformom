import { useLanguage } from "../i18n/LanguageContext";
import type { FoodMatch } from "../utils/matchFoods";
import { getFoodCategory } from "../utils/foodHelpers";
import { CategoryBadge } from "./CategoryBadge";
import { DifficultyBadge } from "./DifficultyBadge";

interface FoodMatchCardProps {
  match: FoodMatch;
  onOpen: (food: FoodMatch["food"]) => void;
}

export function FoodMatchCard({ match, onOpen }: FoodMatchCardProps) {
  const { t, foodName, ingredientLabel, locale } = useLanguage();
  const { food, matchedCount, totalCount, missing } = match;
  const pct = Math.round((matchedCount / totalCount) * 100);

  return (
    <button
      type="button"
      onClick={() => onOpen(food)}
      className="mb-3 w-full rounded-2xl border border-[#e5ddd4] bg-white/90 p-4 text-start shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <strong className="text-espresso">
          {food.emoji} {foodName(food)}
        </strong>
        <DifficultyBadge difficulty={food.difficulty} />
      </div>
      <div className="mt-2">
        <CategoryBadge category={getFoodCategory(food)} />
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#f0ebe4]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sage to-[#5a9a7a] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-espresso/60">
        {matchedCount}/{totalCount} {t("ingredientsMatched")}
        {missing.length > 0 && (
          <span className="text-warm-dark">
            {" "}
            — {t("missing")}:{" "}
            {missing.map((item) => ingredientLabel(item)).join(locale === "fa" ? "، " : ", ")}
          </span>
        )}
      </p>
      <p className="mt-2 text-xs font-semibold text-warm">{t("showRecipe")} →</p>
    </button>
  );
}
