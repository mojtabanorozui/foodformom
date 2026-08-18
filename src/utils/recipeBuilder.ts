import { imageForStep } from "../data/stepImages";
import type { Food, Recipe, RecipeStep } from "../type";
import { getFoodCategory } from "./foodHelpers";

export function buildRecipe(
  food: Food,
  stepsEn: string[],
  stepsFa: string[],
  imageKeys?: string[],
): Recipe {
  const mealCat = getFoodCategory(food);
  const steps: RecipeStep[] = stepsEn.map((textEn, i) => ({
    textEn,
    textFa: stepsFa[i] ?? textEn,
    imageKey: imageKeys?.[i] ?? imageForStep(mealCat, i),
  }));
  return { steps };
}

export function normalizeRecipe(food: Food, recipe: Recipe): Recipe {
  if (recipe.steps?.length) return recipe;

  const stepsEn = recipe.stepsEn ?? [];
  const stepsFa = recipe.stepsFa ?? stepsEn;
  return buildRecipe(food, stepsEn, stepsFa);
}

export function getStepText(
  step: RecipeStep,
  locale: "en" | "fa",
): string {
  return locale === "fa" ? step.textFa : step.textEn;
}
