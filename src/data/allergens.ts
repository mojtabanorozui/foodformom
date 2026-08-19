import type { Allergen, Food } from "../type";

export const ALLERGEN_CONFIG: Record<
  Allergen,
  { icon: string; labelKey: string }
> = {
  dairy: { icon: "🥛", labelKey: "allergen_dairy" },
  egg: { icon: "🥚", labelKey: "allergen_egg" },
  tree_nut: { icon: "🌰", labelKey: "allergen_tree_nut" },
  peanut: { icon: "🥜", labelKey: "allergen_peanut" },
  gluten: { icon: "🌾", labelKey: "allergen_gluten" },
  shellfish: { icon: "🦐", labelKey: "allergen_shellfish" },
  fish: { icon: "🐟", labelKey: "allergen_fish" },
  sesame: { icon: "⚪", labelKey: "allergen_sesame" },
};

const INGREDIENT_ALLERGENS: Record<string, Allergen[]> = {
  yogurt: ["dairy"],
  butter: ["dairy"],
  milk: ["dairy"],
  cream: ["dairy"],
  kashk: ["dairy"],
  "feta cheese": ["dairy"],
  egg: ["egg"],
  "egg white": ["egg"],
  "egg yolk": ["egg"],
  walnut: ["tree_nut"],
  almond: ["tree_nut"],
  pistachio: ["tree_nut"],
  flour: ["gluten"],
  bread: ["gluten"],
  wheat: ["gluten"],
  barley: ["gluten"],
  oats: ["gluten"],
  noodles: ["gluten"],
  "phyllo dough": ["gluten"],
  "chickpea flour": ["gluten"],
  "rice flour": ["gluten"],
  "sesame flour": ["gluten"],
  yeast: ["gluten"],
  fish: ["fish"],
  shrimp: ["shellfish"],
  "sesame seeds": ["sesame"],
  tahini: ["sesame"],
};

export function getFoodAllergens(food: Food): Allergen[] {
  const found = new Set<Allergen>();
  for (const ing of food.ingredients) {
    const key = ing.toLowerCase();
    for (const allergen of INGREDIENT_ALLERGENS[key] ?? []) {
      found.add(allergen);
    }
  }
  return [...found];
}

export function getIngredientAllergens(ingredient: string): Allergen[] {
  return INGREDIENT_ALLERGENS[ingredient.toLowerCase()] ?? [];
}

export function getTextAllergens(texts: string[]): Allergen[] {
  const found = new Set<Allergen>();
  for (const text of texts) {
    const lower = text.toLowerCase();
    for (const [ingredient, allergens] of Object.entries(INGREDIENT_ALLERGENS)) {
      if (lower.includes(ingredient)) {
        for (const allergen of allergens) found.add(allergen);
      }
    }
  }
  return [...found];
}
