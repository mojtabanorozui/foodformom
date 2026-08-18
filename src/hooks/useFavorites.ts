import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "foodformom-favorites";

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => readFavorites());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((foodId: string) => {
    setFavorites((prev) =>
      prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [foodId, ...prev],
    );
  }, []);

  const isFavorite = useCallback(
    (foodId: string) => favorites.includes(foodId),
    [favorites],
  );

  return { favorites, toggleFavorite, isFavorite };
}
