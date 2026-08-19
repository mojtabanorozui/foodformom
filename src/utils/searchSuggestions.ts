import { foodLabelsFa } from "../i18n/foodLabels.fa";
import { ingredientLabelsFa } from "../i18n/ingredientLabels.fa";
import type { Food, PeopleRecipe } from "../type";
import { hasPersianScript, searchIncludes } from "./searchText";

export interface SearchSuggestion {
  id: string;
  label: string;
  sublabel?: string;
  emoji?: string;
  type: "food" | "people";
  food?: Food;
  peopleRecipe?: PeopleRecipe;
}

function foodSearchText(food: Food): string {
  const faName = foodLabelsFa[food.id] ?? "";
  const faIngredients = food.ingredients
    .map((key) => ingredientLabelsFa[key] ?? "")
    .join(" ");
  return [food.name, faName, food.ingredients.join(" "), faIngredients].join(" ");
}

function minQueryLength(query: string): number {
  return hasPersianScript(query) ? 1 : 2;
}

export function getSearchSuggestions(
  query: string,
  foods: Food[],
  peopleRecipes: PeopleRecipe[],
  foodName: (food: Food) => string,
  limit = 8,
): SearchSuggestion[] {
  const q = query.trim();
  if (q.length < minQueryLength(q)) return [];

  const results: SearchSuggestion[] = [];

  for (const food of foods) {
    if (searchIncludes(foodSearchText(food), q)) {
      results.push({
        id: `food-${food.id}`,
        label: foodName(food),
        sublabel: food.name !== foodName(food) ? food.name : undefined,
        emoji: food.emoji,
        type: "food",
        food,
      });
    }
  }

  for (const recipe of peopleRecipes) {
    const searchable = [recipe.name, ...recipe.ingredients].join(" ");
    if (searchIncludes(searchable, q)) {
      results.push({
        id: `people-${recipe.id}`,
        label: recipe.name,
        sublabel: recipe.authorName,
        emoji: recipe.emoji,
        type: "people",
        peopleRecipe: recipe,
      });
    }
  }

  return results.slice(0, limit);
}
