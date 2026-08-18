export type Difficulty = "Easy" | "Normal" | "Hard";

export type MealCategory =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "dessert"
  | "appetizer"
  | "soup"
  | "snack";

export interface Food {
  id: string;
  name: string;
  wikiTitle?: string;
  difficulty: Difficulty;
  ingredients: string[];
  emoji?: string;
  category?: MealCategory;
}

export interface RecipeStep {
  textEn: string;
  textFa: string;
  imageKey: string;
}

export interface Recipe {
  steps: RecipeStep[];
  /** @deprecated use steps */
  stepsEn?: string[];
  /** @deprecated use steps */
  stepsFa?: string[];
}

export type AppTab = "browse" | "spin" | "favorites" | "community";

export type CategoryFilter = MealCategory | "all";

export interface UserRecipe {
  id: string;
  foodId: string;
  foodName: string;
  authorName: string;
  title: string;
  ingredients: string[];
  steps: string[];
  note?: string;
  createdAt: number;
}
