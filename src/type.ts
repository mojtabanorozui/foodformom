export type Difficulty = "Easy" | "Normal" | "Hard";

export interface Food {
  id: string;
  name: string;
  wikiTitle?: string;
  difficulty: Difficulty;
  ingredients: string[];
  emoji?: string;
}

export interface Recipe {
  stepsEn: string[];
  stepsFa: string[];
}
