import { foodCategories } from "../data/foodCategories";
import type { Food, MealCategory } from "../type";

export function getFoodCategory(food: Food): MealCategory {
  return food.category ?? foodCategories[food.id] ?? "dinner";
}

export function enrichFood(food: Food): Food {
  return { ...food, category: getFoodCategory(food) };
}

export const allCategories: MealCategory[] = [
  "breakfast",
  "lunch",
  "dinner",
  "dessert",
  "appetizer",
  "soup",
  "snack",
];
