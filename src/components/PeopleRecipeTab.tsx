import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { Food, PeopleRecipe, User, UserRecipe } from "../type";
import { AddPeopleRecipeModal } from "./AddPeopleRecipeModal";
import { AddRecipeModal } from "./AddRecipeModal";
import { PeopleRecipeDetailModal } from "./PeopleRecipeDetailModal";
import { Pagination } from "./Pagination";

const PAGE_SIZE = 20;

interface PeopleRecipeTabProps {
  user: User | null;
  peopleRecipes: PeopleRecipe[];
  userRecipes: UserRecipe[];
  foods: Food[];
  onAddPeopleRecipe: (data: Omit<PeopleRecipe, "id" | "createdAt">) => void;
  onDeletePeopleRecipe: (id: string) => void;
  onAddUserRecipe: (data: Omit<UserRecipe, "id" | "createdAt">) => void;
  onDeleteUserRecipe: (id: string) => void;
  onRequireAuth: () => void;
}

type SubTab = "invented" | "twists";

export function PeopleRecipeTab({
  user,
  peopleRecipes,
  userRecipes,
  foods,
  onAddPeopleRecipe,
  onDeletePeopleRecipe,
  onAddUserRecipe,
  onDeleteUserRecipe,
  onRequireAuth,
}: PeopleRecipeTabProps) {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<SubTab>("invented");
  const [addOwnOpen, setAddOwnOpen] = useState(false);
  const [addTwistOpen, setAddTwistOpen] = useState(false);
  const [selectedPeopleRecipe, setSelectedPeopleRecipe] = useState<PeopleRecipe | null>(null);
  const [expandedTwist, setExpandedTwist] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const inventedTotalPages = Math.max(1, Math.ceil(peopleRecipes.length / PAGE_SIZE));
  const twistsTotalPages = Math.max(1, Math.ceil(userRecipes.length / PAGE_SIZE));
  const paginatedInvented = peopleRecipes.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const paginatedTwists = userRecipes.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  function handleAddOwn() {
    if (!user) {
      onRequireAuth();
      return;
    }
    setAddOwnOpen(true);
  }

  function handleAddTwist() {
    if (!user) {
      onRequireAuth();
      return;
    }
    setAddTwistOpen(true);
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="w-full space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-warm via-[#d4875a] to-sage p-6 text-white shadow-lg">
        <div className="pointer-events-none absolute -top-6 -right-6 text-8xl opacity-20">
          👩‍🍳
        </div>
        <h2 className="font-display text-2xl font-bold">{t("peopleRecipeTitle")}</h2>
        <p className="mt-1 text-sm text-white/80">{t("peopleRecipeSubtitle")}</p>
        {!user && (
          <p className="mt-2 text-xs font-semibold text-white/90">{t("authRequiredHint")}</p>
        )}
      </div>

      <div className="flex rounded-2xl bg-white/70 p-1.5 shadow-inner ring-1 ring-[#e5ddd4]">
        <button
          type="button"
          onClick={() => {
            setSubTab("invented");
            setPage(1);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
            subTab === "invented"
              ? "bg-sage text-white shadow-md"
              : "text-espresso/60 hover:bg-white/80"
          }`}
        >
          ✨ {t("peopleRecipeInvented")} ({peopleRecipes.length})
        </button>
        <button
          type="button"
          onClick={() => {
            setSubTab("twists");
            setPage(1);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
            subTab === "twists"
              ? "bg-warm text-white shadow-md"
              : "text-espresso/60 hover:bg-white/80"
          }`}
        >
          📝 {t("peopleRecipeTwists")} ({userRecipes.length})
        </button>
      </div>

      {subTab === "invented" && (
        <>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddOwn}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sage to-warm px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.97]"
            >
              {t("peopleRecipeAddOwn")}
            </button>
          </div>

          {peopleRecipes.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-[#e5ddd4] py-16 text-center">
              <p className="mb-3 text-5xl">✨</p>
              <p className="text-espresso/50">{t("peopleRecipeEmpty")}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {paginatedInvented.map((recipe) => (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => setSelectedPeopleRecipe(recipe)}
                    className="overflow-hidden rounded-2xl bg-white p-4 text-start shadow-sm ring-1 ring-[#e5ddd4] transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-4xl">{recipe.emoji ?? "🍽️"}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-espresso">{recipe.name}</p>
                        <p className="mt-0.5 text-xs text-espresso/50">
                          {t("communityPostedBy")} {recipe.authorName} ·{" "}
                          {formatDate(recipe.createdAt)}
                        </p>
                        <span className="mt-2 inline-block rounded-full bg-sage/15 px-2 py-0.5 text-[10px] font-bold text-sage">
                          {t("peopleRecipeBadge")}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <Pagination page={page} totalPages={inventedTotalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}

      {subTab === "twists" && (
        <>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddTwist}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-warm to-sage px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.97]"
            >
              {t("communityAddRecipe")}
            </button>
          </div>

          {userRecipes.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-[#e5ddd4] py-16 text-center">
              <p className="mb-3 text-5xl">📝</p>
              <p className="text-espresso/50">{t("communityEmpty")}</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {paginatedTwists.map((recipe) => {
                  const isOpen = expandedTwist === recipe.id;
                  const food = foods.find((f) => f.id === recipe.foodId);
                  const canDelete = !user || recipe.userId === user.id;

                  return (
                    <div
                      key={recipe.id}
                      className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e5ddd4]"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedTwist(isOpen ? null : recipe.id)}
                        className="flex w-full items-start gap-3 px-4 py-4 text-start hover:bg-warm/5"
                      >
                        <span className="mt-0.5 text-3xl">{food?.emoji ?? "🍽️"}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-espresso">{recipe.title}</p>
                          <p className="mt-0.5 text-xs font-semibold text-warm">
                            {t("communityForFood")} {recipe.foodName}
                          </p>
                          <p className="mt-0.5 text-xs text-espresso/50">
                            {t("communityPostedBy")} {recipe.authorName} ·{" "}
                            {formatDate(recipe.createdAt)}
                          </p>
                        </div>
                        <span
                          className="mt-1 shrink-0 text-espresso/30 transition-transform"
                          style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                        >
                          ▼
                        </span>
                      </button>

                      {isOpen && (
                        <div className="space-y-4 border-t border-[#e5ddd4] px-4 pb-4 pt-3">
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
                          <ol className="space-y-2">
                            {recipe.steps.map((step, i) => (
                              <li key={i} className="flex gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warm text-xs font-bold text-white">
                                  {i + 1}
                                </span>
                                <p className="pt-0.5 text-sm leading-relaxed text-espresso/80">
                                  {step}
                                </p>
                              </li>
                            ))}
                          </ol>
                          {canDelete && (
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => onDeleteUserRecipe(recipe.id)}
                                className="text-xs font-semibold text-red-400 hover:text-red-600"
                              >
                                🗑 {t("communityDelete")}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <Pagination page={page} totalPages={twistsTotalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}

      {addOwnOpen && user && (
        <AddPeopleRecipeModal
          authorName={user.displayName}
          onClose={() => setAddOwnOpen(false)}
          onSubmit={(data) =>
            onAddPeopleRecipe({ ...data, userId: user.id })
          }
        />
      )}

      {addTwistOpen && user && (
        <AddRecipeModal
          authorName={user.displayName}
          onClose={() => setAddTwistOpen(false)}
          onSubmit={(data) =>
            onAddUserRecipe({ ...data, userId: user.id, authorName: user.displayName })
          }
        />
      )}

      {selectedPeopleRecipe && (
        <PeopleRecipeDetailModal
          recipe={selectedPeopleRecipe}
          canDelete={!!user && selectedPeopleRecipe.userId === user.id}
          onClose={() => setSelectedPeopleRecipe(null)}
          onDelete={onDeletePeopleRecipe}
        />
      )}
    </div>
  );
}
