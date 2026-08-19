import { useState, useCallback, useEffect } from "react";
import type { PeopleRecipe } from "../type";
import {
  apiCreatePeopleRecipe,
  apiDeletePeopleRecipe,
  apiFetchPeopleRecipes,
  checkApiHealth,
} from "../lib/api";

const STORAGE_KEY = "foodformom-people-recipes";

function loadLocal(): PeopleRecipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PeopleRecipe[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(recipes: PeopleRecipe[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function usePeopleRecipes() {
  const [recipes, setRecipes] = useState<PeopleRecipe[]>(loadLocal);
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
          const data = await apiFetchPeopleRecipes();
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

  const addPeopleRecipe = useCallback(
    async (recipe: Omit<PeopleRecipe, "id" | "createdAt">) => {
      if (apiReady && dbReady) {
        try {
          const created = await apiCreatePeopleRecipe(recipe);
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

      const newRecipe: PeopleRecipe = {
        ...recipe,
        id: `pr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
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

  const deletePeopleRecipe = useCallback(
    async (id: string, userId?: string) => {
      if (apiReady && dbReady && userId) {
        try {
          await apiDeletePeopleRecipe(id);
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

  return { peopleRecipes: recipes, addPeopleRecipe, deletePeopleRecipe };
}
