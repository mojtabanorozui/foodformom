import { useState, useCallback, useEffect } from "react";
import type { User } from "../type";
import {
  apiGetMe,
  apiLogin,
  apiLogout,
  apiSignup,
  checkApiHealth,
  getAuthToken,
  setAuthToken,
} from "../lib/api";

const USERS_KEY = "foodformom-users";
const SESSION_KEY = "foodformom-session";

interface StoredUser extends User {
  passwordHash: string;
}

function hashPassword(password: string): string {
  return btoa(unescape(encodeURIComponent(password)));
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadLocalUser(): User | null {
  const id = localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const stored = loadUsers().find((u) => u.id === id);
  if (!stored) return null;
  const { passwordHash: _, ...publicUser } = stored;
  return publicUser;
}

function clearLocalAuth() {
  localStorage.removeItem(SESSION_KEY);
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const health = await checkApiHealth();
      if (cancelled) return;
      setApiReady(health.online);
      setDbReady(health.db);

      if (health.online && health.db) {
        clearLocalAuth();
        if (getAuthToken()) {
          const me = await apiGetMe();
          if (!cancelled) setUser(me);
        }
      } else if (!health.online) {
        setUser(loadLocalUser());
      }

      if (!cancelled) setLoaded(true);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshHealth = useCallback(async () => {
    const health = await checkApiHealth();
    setApiReady(health.online);
    setDbReady(health.db);
    return health;
  }, []);

  const signup = useCallback(
    async (email: string, password: string, displayName: string): Promise<string | null> => {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail || !password || !displayName.trim()) {
        return "authErrorRequired";
      }
      if (password.length < 6) return "authErrorPassword";

      const health = await refreshHealth();

      if (health.online && health.db) {
        try {
          const { token, user: newUser } = await apiSignup(
            normalizedEmail,
            password,
            displayName.trim(),
          );
          clearLocalAuth();
          setAuthToken(token);
          setUser(newUser);
          return null;
        } catch (err) {
          return err instanceof Error ? err.message : "authErrorInvalid";
        }
      }

      if (health.online) {
        return "authErrorServer";
      }

      const users = loadUsers();
      if (users.some((u) => u.email === normalizedEmail)) {
        return "authErrorEmailTaken";
      }

      const newUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        email: normalizedEmail,
        displayName: displayName.trim(),
        passwordHash: hashPassword(password),
        createdAt: Date.now(),
      };

      users.push(newUser);
      saveUsers(users);
      localStorage.setItem(SESSION_KEY, newUser.id);
      const { passwordHash: _, ...publicUser } = newUser;
      setUser(publicUser);
      return null;
    },
    [refreshHealth],
  );

  const login = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      const normalizedEmail = email.trim().toLowerCase();

      const health = await refreshHealth();

      if (health.online && health.db) {
        try {
          const { token, user: loggedIn } = await apiLogin(normalizedEmail, password);
          clearLocalAuth();
          setAuthToken(token);
          setUser(loggedIn);
          return null;
        } catch (err) {
          return err instanceof Error ? err.message : "authErrorInvalid";
        }
      }

      if (health.online) {
        return "authErrorServer";
      }

      const stored = loadUsers().find((u) => u.email === normalizedEmail);
      if (!stored || stored.passwordHash !== hashPassword(password)) {
        return "authErrorInvalid";
      }
      localStorage.setItem(SESSION_KEY, stored.id);
      const { passwordHash: _, ...publicUser } = stored;
      setUser(publicUser);
      return null;
    },
    [refreshHealth],
  );

  const logout = useCallback(async () => {
    const health = await refreshHealth();
    if (health.online && health.db) await apiLogout();
    clearLocalAuth();
    setAuthToken(null);
    setUser(null);
  }, [refreshHealth]);

  return { user, signup, login, logout, isLoggedIn: user != null, apiReady, dbReady, loaded };
}
