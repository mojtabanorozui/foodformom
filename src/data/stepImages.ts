/** Step type → emoji + gradient color for offline-friendly placeholders */
export const stepImages = {
  prep:    { emoji: "🥄", gradient: "from-amber-100 to-orange-200" },
  chop:    { emoji: "🔪", gradient: "from-green-100 to-emerald-200" },
  saute:   { emoji: "🍳", gradient: "from-yellow-100 to-amber-200" },
  simmer:  { emoji: "🫕", gradient: "from-red-100 to-orange-200" },
  grill:   { emoji: "🔥", gradient: "from-orange-100 to-red-200" },
  rice:    { emoji: "🍚", gradient: "from-stone-100 to-amber-100" },
  serve:   { emoji: "🍽️", gradient: "from-blue-100 to-indigo-200" },
  bake:    { emoji: "🫓", gradient: "from-yellow-50 to-amber-200" },
  mix:     { emoji: "🥣", gradient: "from-teal-100 to-cyan-200" },
  herbs:   { emoji: "🌿", gradient: "from-green-100 to-lime-200" },
  dessert: { emoji: "🍮", gradient: "from-pink-100 to-rose-200" },
  bread:   { emoji: "🍞", gradient: "from-amber-100 to-yellow-200" },
} as const;

export type StepImageKey = keyof typeof stepImages;

/** Default image sequence per meal type */
export const stepImageSequences: Record<string, StepImageKey[]> = {
  dinner: ["prep", "chop", "saute", "simmer", "herbs", "serve"],
  lunch: ["prep", "chop", "mix", "saute", "serve"],
  breakfast: ["prep", "mix", "saute", "serve"],
  dessert: ["prep", "mix", "bake", "dessert", "serve"],
  appetizer: ["prep", "chop", "mix", "serve"],
  soup: ["prep", "chop", "simmer", "herbs", "serve"],
  snack: ["prep", "mix", "bake", "serve"],
  grill: ["prep", "mix", "grill", "serve"],
  rice: ["prep", "rice", "saute", "simmer", "serve"],
};

export function imageForStep(mealCategory: string, stepIndex: number): StepImageKey {
  const seq =
    stepImageSequences[mealCategory] ?? stepImageSequences.dinner;
  return seq[Math.min(stepIndex, seq.length - 1)];
}

export function heroImageForCategory(category: string): StepImageKey {
  const heroes: Record<string, StepImageKey> = {
    breakfast: "saute",
    lunch: "serve",
    dinner: "simmer",
    dessert: "dessert",
    appetizer: "herbs",
    soup: "simmer",
    snack: "bread",
  };
  return heroes[category] ?? "serve";
}
