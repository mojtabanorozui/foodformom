import { useState, useCallback } from "react";
import type { UserRecipe } from "../type";

const STORAGE_KEY = "foodformom-user-recipes";

function load(): UserRecipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserRecipe[]) : [];
  } catch {
    return [];
  }
}

function save(recipes: UserRecipe[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function useUserRecipes() {
  const [recipes, setRecipes] = useState<UserRecipe[]>(load);

  const addRecipe = useCallback((recipe: Omit<UserRecipe, "id" | "createdAt">) => {
    const newRecipe: UserRecipe = {
      ...recipe,
      id: `ur_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
    };
    setRecipes((prev) => {
      const next = [newRecipe, ...prev];
      save(next);
      return next;
    });
    return newRecipe;
  }, []);

  const deleteRecipe = useCallback((id: string) => {
    setRecipes((prev) => {
      const next = prev.filter((r) => r.id !== id);
      save(next);
      return next;
    });
  }, []);

  const recipesForFood = useCallback(
    (foodId: string) => recipes.filter((r) => r.foodId === foodId),
    [recipes],
  );

  return { recipes, addRecipe, deleteRecipe, recipesForFood };
}
