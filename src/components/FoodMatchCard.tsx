import { useLanguage } from "../i18n/LanguageContext";
import type { FoodMatch } from "../utils/matchFoods";
import { DifficultyBadge } from "./DifficultyBadge";
import { RecipeCard } from "./RecipeCard";

interface FoodMatchCardProps {
  match: FoodMatch;
}

export function FoodMatchCard({ match }: FoodMatchCardProps) {
  const { t, foodName, ingredientLabel, locale } = useLanguage();
  const { food, matchedCount, totalCount, missing } = match;
  const pct = Math.round((matchedCount / totalCount) * 100);

  return (
    <div className="mb-3 rounded-2xl border border-[#e5ddd4] bg-white/90 p-4 text-start shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-espresso">
          {food.emoji} {foodName(food)}
        </strong>
        <DifficultyBadge difficulty={food.difficulty} />
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

      <RecipeCard food={food} defaultOpen={false} />
    </div>
  );
}
