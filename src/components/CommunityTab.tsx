import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { UserRecipe, Food } from "../type";
import { AddRecipeModal } from "./AddRecipeModal";

interface CommunityTabProps {
  recipes: UserRecipe[];
  onDelete: (id: string) => void;
  onAddRecipe: (data: Omit<UserRecipe, "id" | "createdAt">) => void;
  onOpenFood: (food: Food) => void;
  foods: Food[];
}

export function CommunityTab({ recipes, onDelete, onAddRecipe, foods }: CommunityTabProps) {
  const { t } = useLanguage();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filterFoodId, setFilterFoodId] = useState<string>("all");

  const uniqueFoodIds = Array.from(new Set(recipes.map((r) => r.foodId)));
  const foodsWithRecipes = uniqueFoodIds
    .map((id) => foods.find((f) => f.id === id))
    .filter((f): f is Food => f != null);

  const displayed = filterFoodId === "all"
    ? recipes
    : recipes.filter((r) => r.foodId === filterFoodId);

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="w-full space-y-6">
      {/* Header card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-warm via-[#d4875a] to-sage p-6 text-white shadow-lg">
        <div className="pointer-events-none absolute -top-6 -right-6 text-8xl opacity-20">👩‍🍳</div>
        <h2 className="font-display text-2xl font-bold">{t("communityTitle")}</h2>
        <p className="mt-1 text-sm text-white/80">{t("communitySubtitle")}</p>
        <button
          onClick={() => setAddModalOpen(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/30 active:scale-[0.97]"
        >
          {t("communityAddRecipe")}
        </button>
      </div>

      {/* Filter bar */}
      {foodsWithRecipes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterFoodId("all")}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              filterFoodId === "all"
                ? "bg-warm text-white shadow-sm"
                : "bg-white/70 text-espresso/70 ring-1 ring-[#e5ddd4] hover:bg-white"
            }`}
          >
            {t("cat_all")} ({recipes.length})
          </button>
          {foodsWithRecipes.map((food) => {
            const count = recipes.filter((r) => r.foodId === food.id).length;
            return (
              <button
                key={food.id}
                onClick={() => setFilterFoodId(food.id)}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                  filterFoodId === food.id
                    ? "bg-warm text-white shadow-sm"
                    : "bg-white/70 text-espresso/70 ring-1 ring-[#e5ddd4] hover:bg-white"
                }`}
              >
                <span>{food.emoji ?? "🍽️"}</span>
                <span>{food.name}</span>
                <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Recipe list */}
      {displayed.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-[#e5ddd4] py-16 text-center">
          <p className="text-5xl mb-3">📝</p>
          <p className="text-espresso/50">{t("communityEmpty")}</p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="mt-4 text-sm font-semibold text-warm hover:underline"
          >
            {t("communityAddRecipe")}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((recipe) => {
            const isOpen = expanded === recipe.id;
            const isDeleting = confirmDelete === recipe.id;
            const food = foods.find((f) => f.id === recipe.foodId);

            return (
              <div
                key={recipe.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e5ddd4] transition-all"
              >
                {/* Card header */}
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : recipe.id)}
                  className="flex w-full items-start gap-3 px-4 py-4 text-start hover:bg-warm/5 transition-colors"
                >
                  <span className="mt-0.5 text-3xl">{food?.emoji ?? "🍽️"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-espresso truncate">{recipe.title}</p>
                    <p className="text-xs text-warm font-semibold mt-0.5">
                      {t("communityForFood")} {recipe.foodName}
                    </p>
                    <p className="text-xs text-espresso/50 mt-0.5">
                      {t("communityPostedBy")} <span className="font-medium text-espresso/70">{recipe.authorName}</span>
                      {" · "}
                      {formatDate(recipe.createdAt)}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-espresso/30 transition-transform duration-200 mt-1"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                  >
                    ▼
                  </span>
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div className="border-t border-[#e5ddd4] px-4 pb-4 pt-3 space-y-4">
                    {/* Ingredients */}
                    <div>
                      <p className="mb-2 text-xs font-bold tracking-wide text-espresso/50 uppercase">
                        {t("communityIngredients")}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-sage/10 px-3 py-1 text-xs font-medium text-espresso ring-1 ring-sage/20"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Steps */}
                    <div>
                      <p className="mb-2 text-xs font-bold tracking-wide text-espresso/50 uppercase">
                        {t("communitySteps")}
                      </p>
                      <ol className="space-y-2">
                        {recipe.steps.map((step, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warm text-xs font-bold text-white">
                              {i + 1}
                            </span>
                            <p className="text-sm leading-relaxed text-espresso/80 pt-0.5">{step}</p>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Note */}
                    {recipe.note && (
                      <div className="rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200/60">
                        <p className="text-xs font-bold text-amber-700 mb-1">💡 {t("communityNote")}</p>
                        <p className="text-sm text-amber-800/80">{recipe.note}</p>
                      </div>
                    )}

                    {/* Delete */}
                    <div className="pt-1 flex justify-end">
                      {isDeleting ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-espresso/60">{t("communityDeleteConfirm")}</span>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(null)}
                            className="rounded-lg bg-[#e5ddd4] px-3 py-1.5 text-xs font-semibold text-espresso hover:bg-[#d8cfc5]"
                          >
                            {t("communityCancel")}
                          </button>
                          <button
                            type="button"
                            onClick={() => { onDelete(recipe.id); setConfirmDelete(null); }}
                            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                          >
                            {t("communityDelete")}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(recipe.id)}
                          className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors"
                        >
                          🗑 {t("communityDelete")}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {addModalOpen && (
        <AddRecipeModal
          onClose={() => setAddModalOpen(false)}
          onSubmit={onAddRecipe}
        />
      )}
    </div>
  );
}
