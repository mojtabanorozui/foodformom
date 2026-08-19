import { getTextAllergens } from "../data/allergens";
import { useLanguage } from "../i18n/LanguageContext";
import type { PeopleRecipe } from "../type";
import { AllergenBadges } from "./AllergenBadges";
import { CategoryBadge } from "./CategoryBadge";
import { DifficultyBadge } from "./DifficultyBadge";

interface PeopleRecipeDetailModalProps {
  recipe: PeopleRecipe;
  canDelete: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function PeopleRecipeDetailModal({
  recipe,
  canDelete,
  onClose,
  onDelete,
}: PeopleRecipeDetailModalProps) {
  const { t } = useLanguage();
  const allergens = getTextAllergens(recipe.ingredients);

  return (
    <div
      className="fixed inset-0 z-[250] overflow-y-auto bg-[#3d405b]/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-auto my-4 w-full max-w-2xl overflow-hidden rounded-3xl bg-cream shadow-2xl ring-1 ring-white/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-sage to-warm px-6 py-8 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 end-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg hover:bg-white/30"
          >
            ✕
          </button>
          <span className="text-6xl">{recipe.emoji ?? "🍽️"}</span>
          <h2 className="mt-3 font-display text-2xl font-bold">{recipe.name}</h2>
          <p className="mt-1 text-sm text-white/80">
            {t("communityPostedBy")} {recipe.authorName}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recipe.category && <CategoryBadge category={recipe.category} />}
            <DifficultyBadge difficulty={recipe.difficulty} />
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
              {t("peopleRecipeBadge")}
            </span>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {allergens.length > 0 && (
            <section>
              <h3 className="mb-2 text-sm font-bold tracking-wide text-espresso/60 uppercase">
                {t("allergenContains")}
              </h3>
              <AllergenBadges allergens={allergens} />
            </section>
          )}

          <section>
            <h3 className="mb-3 text-sm font-bold tracking-wide text-espresso/60 uppercase">
              {t("communityIngredients")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-espresso ring-1 ring-[#e5ddd4]"
                >
                  {ing}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-sm font-bold tracking-wide text-espresso/60 uppercase">
              {t("communitySteps")}
            </h3>
            <ol className="space-y-3">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-espresso/85">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {recipe.note && (
            <div className="rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200/60">
              <p className="mb-1 text-xs font-bold text-amber-700">💡 {t("communityNote")}</p>
              <p className="text-sm text-amber-800/80">{recipe.note}</p>
            </div>
          )}

          {canDelete && (
            <div className="flex justify-end border-t border-[#e5ddd4] pt-4">
              <button
                type="button"
                onClick={() => {
                  onDelete(recipe.id);
                  onClose();
                }}
                className="text-sm font-semibold text-red-400 hover:text-red-600"
              >
                🗑 {t("communityDelete")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
