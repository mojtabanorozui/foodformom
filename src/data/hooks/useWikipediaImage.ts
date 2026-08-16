import { useEffect, useState } from "react";

const imageCache = new Map<string, string | null>();

interface UseWikipediaImageResult {
  imageUrl: string | null;
  isLoading: boolean;
  failed: boolean;
}

export function useWikipediaImage(title: string): UseWikipediaImageResult {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setFailed(false);
    setImageUrl(null);

    if (imageCache.has(title)) {
      const cached = imageCache.get(title)!;
      setImageUrl(cached);
      setFailed(cached === null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchImage() {
      try {
        const encodedTitle = encodeURIComponent(title.replace(/ /g, "_"));
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`,
        );

        if (!res.ok) throw new Error("Not found");

        const data = await res.json();
        const url: string | null = data?.thumbnail?.source ?? null;

        imageCache.set(title, url);

        if (!cancelled) {
          setImageUrl(url);
          setFailed(url === null);
          setIsLoading(false);
        }
      } catch {
        imageCache.set(title, null);
        if (!cancelled) {
          setImageUrl(null);
          setFailed(true);
          setIsLoading(false);
        }
      }
    }

    fetchImage();

    return () => {
      cancelled = true;
    };
  }, [title]);

  return { imageUrl, isLoading, failed };
}
