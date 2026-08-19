import type { Food, CategoryFilter } from "../type";
import { foodLabelsFa } from "../i18n/foodLabels.fa";
import { ingredientLabelsFa } from "../i18n/ingredientLabels.fa";
import { getFoodCategory } from "./foodHelpers";
import { searchIncludes } from "./searchText";

function foodSearchText(food: Food): string {
  const faName = foodLabelsFa[food.id] ?? "";
  const faIngredients = food.ingredients
    .map((key) => ingredientLabelsFa[key] ?? "")
    .join(" ");
  return [food.name, faName, food.ingredients.join(" "), faIngredients].join(" ");
}

export function filterFoods(
  foods: Food[],
  category: CategoryFilter,
  query: string,
): Food[] {
  const q = query.trim();

  return foods.filter((food) => {
    const cat = getFoodCategory(food);
    if (category !== "all" && cat !== category) return false;

    if (!q) return true;

    return searchIncludes(foodSearchText(food), q) || searchIncludes(cat, q);
  });
}

export function sortFoodsByName(foods: Food[]): Food[] {
  return [...foods].sort((a, b) => a.name.localeCompare(b.name));
}
