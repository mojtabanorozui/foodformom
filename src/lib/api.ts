import type { PeopleRecipe, User, UserRecipe } from "../type";

const TOKEN_KEY = "foodformom-token";

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch("/api/health");
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiSignup(
  email: string,
  password: string,
  displayName: string,
): Promise<{ token: string; user: User }> {
  return apiFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName }),
  });
}

export async function apiLogin(
  email: string,
  password: string,
): Promise<{ token: string; user: User }> {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function apiGetMe(): Promise<User | null> {
  try {
    const data = await apiFetch<{ user: User }>("/api/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

export async function apiLogout(): Promise<void> {
  try {
    await apiFetch("/api/auth/logout", { method: "POST" });
  } catch {
    // ignore
  }
  setAuthToken(null);
}

export async function apiFetchUserRecipes(): Promise<UserRecipe[]> {
  return apiFetch<UserRecipe[]>("/api/recipes/user");
}

export async function apiCreateUserRecipe(
  recipe: Omit<UserRecipe, "id" | "createdAt">,
): Promise<UserRecipe> {
  return apiFetch<UserRecipe>("/api/recipes/user", {
    method: "POST",
    body: JSON.stringify(recipe),
  });
}

export async function apiDeleteUserRecipe(id: string): Promise<void> {
  await apiFetch(`/api/recipes/user/${id}`, { method: "DELETE" });
}

export async function apiFetchPeopleRecipes(): Promise<PeopleRecipe[]> {
  return apiFetch<PeopleRecipe[]>("/api/recipes/people");
}

export async function apiCreatePeopleRecipe(
  recipe: Omit<PeopleRecipe, "id" | "createdAt">,
): Promise<PeopleRecipe> {
  return apiFetch<PeopleRecipe>("/api/recipes/people", {
    method: "POST",
    body: JSON.stringify(recipe),
  });
}

export async function apiDeletePeopleRecipe(id: string): Promise<void> {
  await apiFetch(`/api/recipes/people/${id}`, { method: "DELETE" });
}
