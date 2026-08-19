import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { Food, PeopleRecipe } from "../type";
import {
  getSearchSuggestions,
  type SearchSuggestion,
} from "../utils/searchSuggestions";
import { hasPersianScript } from "../utils/searchText";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  foods: Food[];
  peopleRecipes: PeopleRecipe[];
  onSelectFood: (food: Food) => void;
  onSelectPeopleRecipe: (recipe: PeopleRecipe) => void;
}

export function SearchBar({
  value,
  onChange,
  foods,
  peopleRecipes,
  onSelectFood,
  onSelectPeopleRecipe,
}: SearchBarProps) {
  const { t, foodName } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isComposing, setIsComposing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (!isComposing) setDraft(value);
  }, [value, isComposing]);

  const suggestions = useMemo(
    () => getSearchSuggestions(draft, foods, peopleRecipes, foodName),
    [draft, foods, peopleRecipes, foodName],
  );

  const minLen = hasPersianScript(draft) ? 1 : 2;
  const showDropdown = open && draft.trim().length >= minLen && suggestions.length > 0;

  useEffect(() => {
    setActiveIndex(-1);
  }, [draft, suggestions.length]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectSuggestion(suggestion: SearchSuggestion) {
    onChange(suggestion.label);
    setOpen(false);
    if (suggestion.type === "food" && suggestion.food) {
      onSelectFood(suggestion.food);
    } else if (suggestion.type === "people" && suggestion.peopleRecipe) {
      onSelectPeopleRecipe(suggestion.peopleRecipe);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        aria-label={draft ? "Clear search" : "Search"}
        onClick={() => {
          if (value) {
            onChange("");
            setDraft("");
          }
          inputRef.current?.focus();
        }}
        className="absolute start-3 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-xl bg-warm/10 text-warm transition-all hover:bg-warm/20 hover:scale-110 active:scale-95"
      >
        {draft ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      <input
        ref={inputRef}
        type="search"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          if (!isComposing) {
            onChange(e.target.value);
            setOpen(true);
          }
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={(e) => {
          setIsComposing(false);
          const next = e.currentTarget.value;
          setDraft(next);
          onChange(next);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={t("searchPlaceholder")}
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="search-suggestions"
        className="w-full rounded-2xl border-2 border-[#e5ddd4] bg-white/95 py-3.5 ps-13 pe-4 text-espresso shadow-sm outline-none transition-all duration-200 placeholder:text-espresso/35 focus:border-warm/60 focus:bg-white focus:shadow-md focus:ring-3 focus:ring-warm/15"
      />

      {showDropdown && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="absolute start-0 end-0 top-[calc(100%+0.5rem)] z-[60] max-h-72 overflow-y-auto rounded-2xl border border-[#e5ddd4] bg-white py-2 shadow-xl ring-1 ring-black/5"
        >
          <li className="px-4 pb-1 text-[10px] font-bold uppercase tracking-wide text-espresso/40">
            {t("searchSuggestions")}
          </li>
          {suggestions.map((suggestion, index) => (
            <li key={suggestion.id} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors ${
                  index === activeIndex ? "bg-warm/10" : "hover:bg-warm/5"
                }`}
              >
                <span className="text-2xl">{suggestion.emoji ?? "🍽️"}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-espresso">
                    {suggestion.label}
                  </span>
                  {suggestion.sublabel && (
                    <span className="block truncate text-xs text-espresso/50">
                      {suggestion.type === "people"
                        ? `${t("communityPostedBy")} ${suggestion.sublabel}`
                        : suggestion.sublabel}
                    </span>
                  )}
                </span>
                {suggestion.type === "people" && (
                  <span className="shrink-0 rounded-full bg-sage/15 px-2 py-0.5 text-[10px] font-bold text-sage">
                    {t("peopleRecipeBadge")}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
