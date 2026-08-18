import { useLanguage } from "../i18n/LanguageContext";
import type { Food } from "../type";
import { getFoodCategory } from "../utils/foodHelpers";
import { heroImageForCategory } from "../data/stepImages";
import { getRecipe } from "../utils/getRecipe";
import { getStepText } from "../utils/recipeBuilder";
import { CategoryBadge } from "./CategoryBadge";
import { DifficultyBadge } from "./DifficultyBadge";
import { StepImage } from "./StepImage";

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

          {/* Step-by-step with photos */}
          <section>
            <h3 className="mb-4 text-sm font-bold tracking-wide text-espresso/60 uppercase">
              {t("recipeSteps")}
            </h3>
            <div className="space-y-5">
              {recipe.steps.map((step, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e5ddd4]"
                >
                  <StepImage
                    imageKey={step.imageKey}
                    className="h-40 w-full sm:h-48"
                  />
                  <div className="flex gap-3 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-espresso/85 sm:text-base">
                      {getStepText(step, locale)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
