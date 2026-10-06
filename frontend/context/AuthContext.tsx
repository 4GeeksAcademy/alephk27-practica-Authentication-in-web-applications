import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "@/lib/api";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/auth-token";
import { getCurrentUser, login as requestLogin } from "@/lib/services/auth";
import type { AuthStatus, CurrentUser, LoginCredentials } from "@/types/auth";

interface AuthContextValue {
  status: AuthStatus;
  user: CurrentUser | null;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  retry: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "No se pudo validar la sesión.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const restoreSession = async () => {
    if (!getAccessToken()) {
      setUser(null);
      setError(null);
      setStatus("anonymous");
      return;
    }

    setStatus("loading");
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setError(null);
      setStatus("authenticated");
    } catch (sessionError) {
      if (sessionError instanceof ApiError && sessionError.status === 401) {
        clearAccessToken();
        setUser(null);
        setError(null);
        setStatus("anonymous");
        return;
      }

      setError(getErrorMessage(sessionError));
      setStatus("error");
    }
  };

  useEffect(() => {
    void restoreSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setStatus("loading");
    setError(null);
    try {
      const token = await requestLogin(credentials);
      setAccessToken(token.access_token);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setStatus("authenticated");
    } catch (loginError) {
      if (loginError instanceof ApiError && loginError.status === 401) {
        clearAccessToken();
        setUser(null);
        setStatus("anonymous");
      } else {
        setStatus(getAccessToken() ? "error" : "anonymous");
      }
      setError(getErrorMessage(loginError));
      throw loginError;
    }
  };

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
    setError(null);
    setStatus("anonymous");
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, error, login, logout, retry: restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}