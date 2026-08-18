import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { Food } from "../type";
import { getRecipe } from "../utils/getRecipe";
import { getStepText } from "../utils/recipeBuilder";
import { StepImage } from "./StepImage";

interface RecipeCardProps {
  food: Food;
  defaultOpen?: boolean;
}

export function RecipeCard({ food, defaultOpen = true }: RecipeCardProps) {
  const { t, locale, ingredientLabel } = useLanguage();
  const [open, setOpen] = useState(defaultOpen);
  const recipe = getRecipe(food);

  return (
    <div className="mt-5 rounded-2xl border border-[#e5ddd4] bg-[#faf8f5]/80 text-start">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start font-semibold text-espresso transition-colors hover:bg-white/60"
      >
        <span>{open ? t("hideRecipe") : t("showRecipe")}</span>
        <span className="text-warm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-[#e5ddd4] px-4 py-4">
          <h3 className="mb-2 text-sm font-bold tracking-wide text-espresso/70 uppercase">
            {t("recipeIngredients")}
          </h3>
          <ul className="mb-4 flex flex-wrap gap-2">
            {food.ingredients.map((item) => (
              <li
                key={item}
                className="rounded-full bg-white px-3 py-1 text-sm text-espresso ring-1 ring-[#e5ddd4]"
              >
                {ingredientLabel(item)}
              </li>
            ))}
          </ul>

          <h3 className="mb-3 text-sm font-bold tracking-wide text-espresso/70 uppercase">
            {t("recipeSteps")}
          </h3>
          <div className="space-y-4">
            {recipe.steps.map((step, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl bg-white ring-1 ring-[#e5ddd4]"
              >
                <StepImage
                  imageKey={step.imageKey}
                  className="h-32 w-full"
                />
                <div className="flex gap-3 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warm/15 text-xs font-bold text-warm-dark">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-espresso/80">
                    {getStepText(step, locale)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
