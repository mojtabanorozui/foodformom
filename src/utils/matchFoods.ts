import type { Food } from "../type";

export interface FoodMatch {
  food: Food;
  matchedCount: number;
  totalCount: number;
  missing: string[];
}

export function matchFoods(foods: Food[], have: string[]): FoodMatch[] {
  const haveSet = new Set(have.map((i) => i.toLowerCase()));

  const results: FoodMatch[] = foods.map((food) => {
    const missing = food.ingredients.filter(
      (ingredient) => !haveSet.has(ingredient.toLowerCase()),
    );
    const matchedCount = food.ingredients.length - missing.length;

    return {
      food,
      matchedCount,
      totalCount: food.ingredients.length,
      missing,
    };
  });

  // Only show foods where you have at least one matching ingredient
  const withMatches = results.filter((r) => r.matchedCount > 0);

  // Best matches first: highest matchedCount, then fewest missing ingredients
  withMatches.sort((a, b) => {
    if (b.matchedCount !== a.matchedCount)
      return b.matchedCount - a.matchedCount;
    return a.missing.length - b.missing.length;
  });

  return withMatches;
}
