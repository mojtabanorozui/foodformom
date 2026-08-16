import { useState } from "react";
import { DifficultyBadge } from "./components/DifficultyBadge";
import { FoodMatchCard } from "./components/FoodMatchCard";
import { IngredientsModal } from "./components/IngredientsModal";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { RecipeCard } from "./components/RecipeCard";
import { SlotReel } from "./components/SlotReel";
import { foods } from "./data/food";
import { useWikipediaImage } from "./data/hooks/useWikipediaImage";
import { useLanguage } from "./i18n/LanguageContext";
import type { Food } from "./type";
import { matchFoods } from "./utils/matchFoods";

function App() {
  const { t, foodName } = useLanguage();
  const [result, setResult] = useState<Food | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const { imageUrl, isLoading, failed } = useWikipediaImage(
    result ? (result.wikiTitle ?? result.name) : "",
  );

  const allIngredients = Array.from(
    new Set(foods.flatMap((food) => food.ingredients)),
  ).sort();

  function handleIngredientsSubmit(selected: string[]) {
    setSelectedIngredients(selected);
    setModalOpen(false);
  }

  const matches =
    selectedIngredients.length > 0
      ? matchFoods(foods, selectedIngredients)
      : [];

  return (
    <div className="bg-food-collage relative flex min-h-svh flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
        <span className="absolute top-[12%] right-[6%] text-6xl">🍰</span>
        <span className="absolute top-[22%] left-[4%] text-5xl">🍕</span>
        <span className="absolute bottom-[18%] right-[10%] text-5xl">🍜</span>
        <span className="absolute bottom-[28%] left-[8%] text-6xl">🧁</span>
      </div>

      <div className="relative z-20 flex justify-center pt-6">
        <LanguageSwitcher />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-espresso drop-shadow-sm sm:text-5xl">
            {t("appTitle")}
          </h1>
          <p className="mt-2 text-lg text-espresso/70">{t("appSubtitle")}</p>
        </header>

        <SlotReel foods={foods} onResult={setResult} />

        <button
          onClick={() => setModalOpen(true)}
          className="mt-8 rounded-2xl border-2 border-sage/40 bg-white/80 px-6 py-3 text-sm font-semibold text-espresso shadow-md backdrop-blur-sm transition-all hover:border-sage hover:bg-white hover:shadow-lg active:scale-[0.98]"
        >
          {t("kitchenButton")}
        </button>

        {matches.length > 0 && (
          <section className="mt-10 w-full max-w-lg">
            <h2 className="mb-4 font-display text-2xl font-bold text-espresso">
              {t("matchingDishes")}
            </h2>
            {matches.map((match) => (
              <FoodMatchCard key={match.food.id} match={match} />
            ))}
          </section>
        )}

        {selectedIngredients.length > 0 && matches.length === 0 && (
          <p className="mt-8 text-espresso/50 italic">{t("noMatches")}</p>
        )}

        {result && (
          <section className="mt-10 w-full max-w-lg animate-[modal-in_0.4s_ease-out] rounded-3xl bg-white/85 p-6 shadow-[0_12px_40px_rgba(61,64,91,0.15)] ring-1 ring-white/80 backdrop-blur-sm">
            <h2 className="font-display text-2xl font-bold text-espresso">
              {result.emoji} {foodName(result)}
            </h2>
            <div className="mt-3">
              <DifficultyBadge difficulty={result.difficulty} />
            </div>
            {isLoading && (
              <p className="mt-4 animate-pulse text-sm text-espresso/50">
                {t("loadingImage")}
              </p>
            )}
            {!isLoading && imageUrl && (
              <img
                src={imageUrl}
                alt={foodName(result)}
                className="mt-4 w-full rounded-2xl object-cover shadow-md ring-2 ring-gold/30"
              />
            )}
            {!isLoading && failed && (
              <p className="mt-4 text-6xl">{result.emoji}</p>
            )}
            <RecipeCard food={result} />
          </section>
        )}
      </main>

      <footer className="relative z-10 py-5 text-center">
        <p className="text-sm text-espresso/60">
          {t("builtBy")}{" "}
          <a
            href="https://github.com/Clevi666"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-warm transition-colors hover:text-warm-dark hover:underline"
          >
            @Clevi666
          </a>
        </p>
      </footer>

      {modalOpen && (
        <IngredientsModal
          allIngredients={allIngredients}
          onClose={() => setModalOpen(false)}
          onSubmit={handleIngredientsSubmit}
        />
      )}
    </div>
  );
}

export default App;
