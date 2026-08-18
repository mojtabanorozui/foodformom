import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "foodformom-recent";
const MAX_RECENT = 12;

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState<string[]>(() => readRecent());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentIds));
  }, [recentIds]);

  const addRecent = useCallback((foodId: string) => {
    setRecentIds((prev) => {
      const next = [foodId, ...prev.filter((id) => id !== foodId)];
      return next.slice(0, MAX_RECENT);
    });
  }, []);

  return { recentIds, addRecent };
}
