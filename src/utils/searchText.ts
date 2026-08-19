/** Normalize text for Persian/English search matching. */
export function normalizeSearchText(text: string): string {
  return text
    .trim()
    .normalize("NFC")
    .replace(/[\u064A\u0649]/g, "\u06CC") // Arabic yeh → Persian ی
    .replace(/\u0643/g, "\u06A9") // Arabic kaf → Persian ک
    .replace(/\u0629/g, "\u0647") // taa marbuta → haa
    .replace(/\u200C/g, " ") // ZWNJ → space
    .replace(/\u00A0/g, " ") // nbsp → space
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function searchIncludes(haystack: string, needle: string): boolean {
  if (!needle) return true;
  return normalizeSearchText(haystack).includes(normalizeSearchText(needle));
}

/** True if the query contains any Persian/Arabic script character. */
export function hasPersianScript(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}
