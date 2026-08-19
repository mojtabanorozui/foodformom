import { useState, useCallback, useEffect } from "react";
import type { UserRecipe } from "../type";
import {
  apiCreateUserRecipe,
  apiDeleteUserRecipe,
  apiFetchUserRecipes,
  checkApiHealth,
} from "../lib/api";

const STORAGE_KEY = "foodformom-user-recipes";

function loadLocal(): UserRecipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserRecipe[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(recipes: UserRecipe[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function useUserRecipes() {
  const [recipes, setRecipes] = useState<UserRecipe[]>(loadLocal);
  const [apiReady, setApiReady] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const health = await checkApiHealth();
      if (cancelled) return;
      setApiReady(health.online);
      setDbReady(health.db);

      if (health.online && health.db) {
        try {
          const data = await apiFetchUserRecipes();
          if (!cancelled) {
            setRecipes(data);
            saveLocal(data);
          }
        } catch {
          if (!cancelled) setRecipes(loadLocal());
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addRecipe = useCallback(
    async (recipe: Omit<UserRecipe, "id" | "createdAt">) => {
      if (apiReady && dbReady) {
        try {
          const created = await apiCreateUserRecipe(recipe);
          setRecipes((prev) => {
            const next = [created, ...prev];
            saveLocal(next);
            return next;
          });
          return created;
        } catch {
          // fall through to local
        }
      }

      const newRecipe: UserRecipe = {
        ...recipe,
        id: `ur_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      };
      setRecipes((prev) => {
        const next = [newRecipe, ...prev];
        saveLocal(next);
        return next;
      });
      return newRecipe;
    },
    [apiReady, dbReady],
  );

  const deleteRecipe = useCallback(
    async (id: string, userId?: string) => {
      if (apiReady && dbReady && userId) {
        try {
          await apiDeleteUserRecipe(id);
        } catch {
          return;
        }
      }

      setRecipes((prev) => {
        const recipe = prev.find((r) => r.id === id);
        if (userId && recipe?.userId && recipe.userId !== userId) return prev;
        const next = prev.filter((r) => r.id !== id);
        saveLocal(next);
        return next;
      });
    },
    [apiReady, dbReady],
  );

  const recipesForFood = useCallback(
    (foodId: string) => recipes.filter((r) => r.foodId === foodId),
    [recipes],
  );

  return { recipes, addRecipe, deleteRecipe, recipesForFood };
}
