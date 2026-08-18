import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { UserRecipe } from "../type";

interface UserRecipesSectionProps {
  recipes: UserRecipe[];
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function UserRecipesSection({ recipes, onDelete, onAdd }: UserRecipesSectionProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <section className="border-t border-[#e5ddd4] pt-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-wide text-espresso/60 uppercase">
            {t("communityTitle")}
          </h3>
          {recipes.length > 0 && (
            <p className="mt-0.5 text-xs text-espresso/40">
              {recipes.length} {t("communityRecipesCount")}
            </p>
          )}
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-warm to-sage px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.97]"
        >
          {t("communityAddRecipe")}
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#e5ddd4] py-8 text-center">
          <p className="text-3xl mb-2">👩‍🍳</p>
          <p className="text-sm text-espresso/50">{t("communityEmpty")}</p>
          <button
            onClick={onAdd}
            className="mt-3 text-sm font-semibold text-warm hover:underline"
          >
            {t("communityAddRecipe")}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => {
            const isOpen = expanded === recipe.id;
            const isDeleting = confirmDelete === recipe.id;
            return (
              <div
                key={recipe.id}
                className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#e5ddd4] transition-all"
              >
                {/* Card header */}
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : recipe.id)}
                  className="flex w-full items-start gap-3 px-4 py-3.5 text-start hover:bg-warm/5 transition-colors"
                >
                  <span className="mt-0.5 text-2xl">📝</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-espresso truncate">{recipe.title}</p>
                    <p className="text-xs text-espresso/50 mt-0.5">
                      {t("communityPostedBy")} <span className="font-medium text-warm">{recipe.authorName}</span>
                      {" · "}
                      {formatDate(recipe.createdAt)}
                    </p>
                  </div>
                  <span className="shrink-0 text-espresso/30 transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "none" }}>
                    ▼
                  </span>
                </button>

                {/* Expanded content */}
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
    </section>
  );
}
