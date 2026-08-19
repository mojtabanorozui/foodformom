import { useMemo, useState, useEffect } from "react";
import { AuthButton } from "./components/AuthButton";
import { AuthModal } from "./components/AuthModal";
import { CategoryFilterBar } from "./components/CategoryFilterBar";
import { FoodBrowseCard } from "./components/FoodBrowseCard";
import { FoodDetailModal } from "./components/FoodDetailModal";
import { FoodMatchCard } from "./components/FoodMatchCard";
import { IngredientsModal } from "./components/IngredientsModal";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { Pagination } from "./components/Pagination";
import { PeopleRecipeDetailModal } from "./components/PeopleRecipeDetailModal";
import { PeopleRecipeTab } from "./components/PeopleRecipeTab";
import { RecentlyViewedRow } from "./components/RecentlyViewedRow";
import { SearchBar } from "./components/SearchBar";
import { SlotReel } from "./components/SlotReel";
import { SplashScreen } from "./components/SplashScreen";
import { TabNav } from "./components/TabNav";
import { foods } from "./data/food";
import { useAuth } from "./hooks/useAuth";
import { useFavorites } from "./hooks/useFavorites";
import { useInstallPrompt } from "./hooks/useInstallPrompt";
import { usePeopleRecipes } from "./hooks/usePeopleRecipes";
import { useRecentlyViewed } from "./hooks/useRecentlyViewed";
import { useUserRecipes } from "./hooks/useUserRecipes";
import { useLanguage } from "./i18n/LanguageContext";
import type { AppTab, CategoryFilter, Food, PeopleRecipe } from "./type";
import { filterFoods } from "./utils/filterFoods";
import { getFoodCategory } from "./utils/foodHelpers";
import { matchFoods } from "./utils/matchFoods";

const SPLASH_KEY = "ffm_splash_v2";
const PAGE_SIZE = 20;

function App() {
  const { t } = useLanguage();
  const { user, signup, login, logout } = useAuth();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { recentIds, addRecent } = useRecentlyViewed();
  const { canInstall, install } = useInstallPrompt();
  const { recipes: userRecipes, addRecipe, deleteRecipe } = useUserRecipes();
  const { peopleRecipes, addPeopleRecipe, deletePeopleRecipe } = usePeopleRecipes();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [browsePage, setBrowsePage] = useState(1);

  const [splashDone, setSplashDone] = useState(
    () => localStorage.getItem(SPLASH_KEY) === "1",
  );

  useEffect(() => {
    if (splashDone) localStorage.setItem(SPLASH_KEY, "1");
  }, [splashDone]);

  const [tab, setTab] = useState<AppTab>("browse");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedPeopleRecipe, setSelectedPeopleRecipe] = useState<PeopleRecipe | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const allIngredients = useMemo(
    () =>
      Array.from(new Set(foods.flatMap((food) => food.ingredients))).sort(),
    [],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: foods.length };
    for (const food of foods) {
      const cat = getFoodCategory(food);
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return counts;
  }, []);

  const filteredFoods = useMemo(
    () => filterFoods(foods, category, search),
    [category, search],
  );

  const browseTotalPages = Math.max(1, Math.ceil(filteredFoods.length / PAGE_SIZE));
  const paginatedFoods = useMemo(
    () => filteredFoods.slice((browsePage - 1) * PAGE_SIZE, browsePage * PAGE_SIZE),
    [filteredFoods, browsePage],
  );

  useEffect(() => {
    setBrowsePage(1);
  }, [category, search]);

  const favoriteFoods = useMemo(
    () => foods.filter((f) => favorites.includes(f.id)),
    [favorites],
  );

  const recentFoods = useMemo(
    () =>
      recentIds
        .map((id) => foods.find((f) => f.id === id))
        .filter((f): f is Food => f != null),
    [recentIds],
  );

  const matches = useMemo(
    () =>
      selectedIngredients.length > 0
        ? matchFoods(filteredFoods, selectedIngredients)
        : [],
    [selectedIngredients, filteredFoods],
  );

  const communityCount = userRecipes.length + peopleRecipes.length;

  function openFood(food: Food) {
    setSelectedFood(food);
    addRecent(food.id);
  }

  function handleSpinResult(food: Food) {
    openFood(food);
  }

  function handleIngredientsSubmit(selected: string[]) {
    setSelectedIngredients(selected);
    setModalOpen(false);
  }

  function requireAuth() {
    setAuthModalOpen(true);
  }

  if (!splashDone) {
    return <SplashScreen onEnter={() => setSplashDone(true)} />;
  }

  return (
    <div className="bg-food-collage relative flex min-h-svh flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
        <span className="absolute top-[12%] right-[6%] text-6xl">🍰</span>
        <span className="absolute top-[22%] left-[4%] text-5xl">🍕</span>
        <span className="absolute bottom-[18%] right-[10%] text-5xl">🍜</span>
        <span className="absolute bottom-[28%] left-[8%] text-6xl">🧁</span>
      </div>

      <div className="relative z-20 flex items-center justify-between px-4 pt-6 sm:px-6">
        <div className="flex flex-1">
          <AuthButton
            user={user}
            onLogin={login}
            onSignup={signup}
            onLogout={logout}
          />
        </div>
        <LanguageSwitcher />
        <div className="flex flex-1 justify-end">
          {canInstall && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 rounded-xl border border-warm/40 bg-white/80 px-3 py-1.5 text-xs font-semibold text-warm shadow-sm backdrop-blur-sm transition-all hover:border-warm hover:bg-white hover:shadow-md active:scale-[0.97]"
            >
              {t("installApp")}
            </button>
          )}
        </div>
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-4 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-espresso drop-shadow-sm sm:text-5xl">
            {t("appTitle")}
          </h1>
        </header>

        {/* Sticky search — sits above filters/tabs so suggestions don't overlap */}
        <div className="sticky top-0 z-40 -mx-4 mb-5 border-b border-[#e5ddd4]/60 bg-cream/95 px-4 pb-4 pt-1 backdrop-blur-md sm:-mx-6 sm:px-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            foods={foods}
            peopleRecipes={peopleRecipes}
            onSelectFood={openFood}
            onSelectPeopleRecipe={(recipe) => {
              setSelectedPeopleRecipe(recipe);
              setTab("peopleRecipe");
            }}
          />
        </div>

        <div className="flex flex-col gap-5">
        <CategoryFilterBar
          value={category}
          onChange={setCategory}
          counts={categoryCounts}
        />
        <TabNav
          active={tab}
          onChange={setTab}
          favoriteCount={favorites.length}
          communityCount={communityCount}
        />

        {/* Browse tab */}
        {tab === "browse" && (
          <div className="flex w-full flex-col gap-8">
            <RecentlyViewedRow
              foods={recentFoods}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onOpen={openFood}
            />

            <section className="w-full">
              <p className="mb-4 text-sm font-semibold text-espresso/50">
                {filteredFoods.length} {t("foodsInCategory")}
                {filteredFoods.length > PAGE_SIZE && (
                  <span className="ms-2 text-espresso/40">
                    · {t("pageShowing")} {(browsePage - 1) * PAGE_SIZE + 1}–
                    {Math.min(browsePage * PAGE_SIZE, filteredFoods.length)}
                  </span>
                )}
              </p>
              {filteredFoods.length === 0 ? (
                <p className="py-12 text-center text-espresso/50 italic">
                  {t("noResults")}
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {paginatedFoods.map((food) => (
                      <FoodBrowseCard
                        key={food.id}
                        food={food}
                        isFavorite={isFavorite(food.id)}
                        onToggleFavorite={toggleFavorite}
                        onOpen={openFood}
                      />
                    ))}
                  </div>
                  <Pagination
                    page={browsePage}
                    totalPages={browseTotalPages}
                    onPageChange={setBrowsePage}
                  />
                </>
              )}
            </section>
          </div>
        )}

        {/* Spin tab */}
        {tab === "spin" && (
          <div className="flex w-full flex-col items-center">
            {filteredFoods.length === 0 ? (
              <p className="py-12 text-espresso/50 italic">{t("noResults")}</p>
            ) : (
              <>
                <p className="mb-4 text-sm text-espresso/50">
                  {filteredFoods.length} {t("foodsInCategory")}
                </p>
                <SlotReel
                  foods={filteredFoods}
                  onResult={handleSpinResult}
                />
              </>
            )}
          </div>
        )}

        {/* Favorites tab */}
        {tab === "favorites" && (
          <section className="w-full">
            {favoriteFoods.length === 0 ? (
              <p className="py-12 text-center text-espresso/50 italic">
                {t("noFavorites")}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteFoods.map((food) => (
                  <FoodBrowseCard
                    key={food.id}
                    food={food}
                    isFavorite
                    onToggleFavorite={toggleFavorite}
                    onOpen={openFood}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* PeopleRecipe tab */}
        {tab === "peopleRecipe" && (
          <PeopleRecipeTab
            user={user}
            peopleRecipes={peopleRecipes}
            userRecipes={userRecipes}
            foods={foods}
            onAddPeopleRecipe={addPeopleRecipe}
            onDeletePeopleRecipe={(id) => deletePeopleRecipe(id, user?.id)}
            onAddUserRecipe={addRecipe}
            onDeleteUserRecipe={(id) => deleteRecipe(id, user?.id)}
            onRequireAuth={requireAuth}
          />
        )}

        {/* Kitchen matcher */}
        <div className="flex justify-center">
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-2xl border-2 border-sage/40 bg-white/80 px-6 py-3 text-sm font-semibold text-espresso shadow-md backdrop-blur-sm transition-all hover:border-sage hover:bg-white hover:shadow-lg active:scale-[0.98]"
          >
            {t("kitchenButton")}
          </button>
        </div>

        {matches.length > 0 && (
          <section className="w-full max-w-lg mx-auto">
            <h2 className="mb-4 font-display text-2xl font-bold text-espresso">
              {t("matchingDishes")}
            </h2>
            {matches.map((match) => (
              <FoodMatchCard
                key={match.food.id}
                match={match}
                onOpen={openFood}
              />
            ))}
          </section>
        )}

        {selectedIngredients.length > 0 && matches.length === 0 && (
          <p className="text-center text-espresso/50 italic">{t("noMatches")}</p>
        )}
        </div>
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

      {selectedFood && (
        <FoodDetailModal
          food={selectedFood}
          isFavorite={isFavorite(selectedFood.id)}
          user={user}
          onClose={() => setSelectedFood(null)}
          onToggleFavorite={toggleFavorite}
          onRequireAuth={requireAuth}
        />
      )}

      {modalOpen && (
        <IngredientsModal
          allIngredients={allIngredients}
          onClose={() => setModalOpen(false)}
          onSubmit={handleIngredientsSubmit}
        />
      )}

      {selectedPeopleRecipe && (
        <PeopleRecipeDetailModal
          recipe={selectedPeopleRecipe}
          canDelete={!!user && selectedPeopleRecipe.userId === user.id}
          onClose={() => setSelectedPeopleRecipe(null)}
          onDelete={(id) => deletePeopleRecipe(id, user?.id)}
        />
      )}

      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onLogin={async (email, password) => {
            const err = await login(email, password);
            if (!err) setAuthModalOpen(false);
            return err;
          }}
          onSignup={async (email, password, displayName) => {
            const err = await signup(email, password, displayName);
            if (!err) setAuthModalOpen(false);
            return err;
          }}
        />
      )}
    </div>
  );
}

export default App;
