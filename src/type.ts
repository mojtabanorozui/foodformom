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

export type Allergen =
  | "dairy"
  | "egg"
  | "tree_nut"
  | "peanut"
  | "gluten"
  | "shellfish"
  | "fish"
  | "sesame";

export type AppTab = "browse" | "spin" | "favorites" | "peopleRecipe";

export type CategoryFilter = MealCategory | "all";

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: number;
}

export interface UserRecipe {
  id: string;
  userId: string;
  foodId: string;
  foodName: string;
  authorName: string;
  title: string;
  ingredients: string[];
  steps: string[];
  note?: string;
  createdAt: number;
}

/** User-invented food with its own name, ingredients, and steps. */
export interface PeopleRecipe {
  id: string;
  userId: string;
  authorName: string;
  name: string;
  emoji?: string;
  difficulty: Difficulty;
  category?: MealCategory;
  ingredients: string[];
  steps: string[];
  note?: string;
  createdAt: number;
}
