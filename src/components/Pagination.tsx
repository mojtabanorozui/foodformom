import { useLanguage } from "../i18n/LanguageContext";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const { t } = useLanguage();

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2 pt-4"
      aria-label="Pagination"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl border border-[#e5ddd4] bg-white px-3 py-2 text-sm font-semibold text-espresso transition-all hover:border-warm disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("pagePrev")}
      </button>

      {visiblePages.map((p, i) => {
        const prev = visiblePages[i - 1];
        const showEllipsis = prev != null && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showEllipsis && (
              <span className="px-1 text-espresso/40">…</span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-10 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                p === page
                  ? "bg-warm text-white shadow-md"
                  : "border border-[#e5ddd4] bg-white text-espresso hover:border-warm"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-xl border border-[#e5ddd4] bg-white px-3 py-2 text-sm font-semibold text-espresso transition-all hover:border-warm disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("pageNext")}
      </button>

      <span className="w-full text-center text-xs text-espresso/50 sm:w-auto">
        {t("pageOf")} {page} / {totalPages}
      </span>
    </nav>
  );
}
