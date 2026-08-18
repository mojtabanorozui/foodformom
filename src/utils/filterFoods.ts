import type { Food, CategoryFilter } from "../type";
import { foodLabelsFa } from "../i18n/foodLabels.fa";
import { getFoodCategory } from "./foodHelpers";

export function filterFoods(
  foods: Food[],
  category: CategoryFilter,
  query: string,
): Food[] {
  const q = query.trim().toLowerCase();

  return foods.filter((food) => {
    const cat = getFoodCategory(food);
    if (category !== "all" && cat !== category) return false;

    if (!q) return true;

    const faName = foodLabelsFa[food.id]?.toLowerCase() ?? "";
    const enName = food.name.toLowerCase();
    const ingredients = food.ingredients.join(" ").toLowerCase();

    return (
      enName.includes(q) ||
      faName.includes(q) ||
      ingredients.includes(q) ||
      cat.includes(q)
    );
  });
}

export function sortFoodsByName(foods: Food[]): Food[] {
  return [...foods].sort((a, b) => a.name.localeCompare(b.name));
}
