import { useLanguage } from "../i18n/LanguageContext";
import type { Food } from "../type";
import { getFoodCategory } from "../utils/foodHelpers";
import { heroImageForCategory } from "../data/stepImages";
import { getRecipe } from "../utils/getRecipe";
import { getStepText } from "../utils/recipeBuilder";
import { CategoryBadge } from "./CategoryBadge";
import { DifficultyBadge } from "./DifficultyBadge";
import { StepImage } from "./StepImage";

const STEP_COLORS = [
  { bg: "bg-warm", ring: "ring-warm/30" },
  { bg: "bg-sage", ring: "ring-sage/30" },
  { bg: "bg-[#7c9e87]", ring: "ring-[#7c9e87]/30" },
  { bg: "bg-[#c07a5f]", ring: "ring-[#c07a5f]/30" },
  { bg: "bg-[#8b7355]", ring: "ring-[#8b7355]/30" },
  { bg: "bg-[#5f7c8b]", ring: "ring-[#5f7c8b]/30" },
];

interface FoodDetailModalProps {
  food: Food;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export function FoodDetailModal({
  food,
  isFavorite,
  onClose,
  onToggleFavorite,
}: FoodDetailModalProps) {
  const { t, locale, foodName, ingredientLabel } = useLanguage();
  const recipe = getRecipe(food);
  const category = getFoodCategory(food);
  const heroKey = recipe.steps[0]?.imageKey ?? heroImageForCategory(category);

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[200] overflow-y-auto bg-[#3d405b]/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="modal-panel mx-auto my-4 w-full max-w-2xl overflow-hidden rounded-3xl bg-cream shadow-2xl ring-1 ring-white/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero */}
        <div className="relative h-56 sm:h-72">
          <StepImage imageKey={heroKey} className="h-full w-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl drop-shadow-2xl sm:text-9xl">
              {food.emoji ?? "🍽️"}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 end-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow-md hover:bg-white"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(food.id)}
            className="absolute top-4 start-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow-md hover:bg-white"
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
          <div className="absolute bottom-4 start-4 end-4">
            <div className="mb-2 flex flex-wrap gap-2">
              <CategoryBadge category={category} />
              <DifficultyBadge difficulty={food.difficulty} />
            </div>
            <h2 className="font-display text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
              {food.emoji} {foodName(food)}
            </h2>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Ingredients */}
          <section>
            <h3 className="mb-3 text-sm font-bold tracking-wide text-espresso/60 uppercase">
              {t("recipeIngredients")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {food.ingredients.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-espresso ring-1 ring-[#e5ddd4]"
                >
                  {ingredientLabel(item)}
                </span>
              ))}
            </div>
          </section>

          {/* Step-by-step */}
          <section>
            <h3 className="mb-4 text-sm font-bold tracking-wide text-espresso/60 uppercase">
              {t("recipeSteps")}
            </h3>
            <div className="flex flex-col">
              {recipe.steps.map((step, i) => {
                const color = STEP_COLORS[i % STEP_COLORS.length];
                const isLast = i === recipe.steps.length - 1;
                return (
                  <div key={i} className="flex gap-4">
                    {/* Timeline spine */}
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${color.bg} ring-4 ${color.ring} text-sm font-bold text-white shadow-sm`}
                      >
                        {i + 1}
                      </span>
                      {!isLast && (
                        <div className="mt-1 w-0.5 flex-1 bg-gradient-to-b from-[#e5ddd4] to-transparent mb-1" />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`pb-5 pt-1 flex-1 ${isLast ? "" : ""}`}>
                      <p className="text-sm leading-relaxed text-espresso/85 sm:text-base">
                        {getStepText(step, locale)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
