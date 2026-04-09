import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  address: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, _password: string) => {
    setState(s => ({ ...s, isLoading: true }));
    // TODO: Replace with Supabase auth.signInWithPassword
    await new Promise(r => setTimeout(r, 600));
    setState({
      isLoading: false,
      isAuthenticated: true,
      user: {
        id: crypto.randomUUID(),
        name: email.split("@")[0],
        email,
        address: "",
        createdAt: new Date().toISOString(),
      },
    });
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string) => {
    setState(s => ({ ...s, isLoading: true }));
    // TODO: Replace with Supabase auth.signUp
    await new Promise(r => setTimeout(r, 600));
    setState({
      isLoading: false,
      isAuthenticated: true,
      user: {
        id: crypto.randomUUID(),
        name,
        email,
        address: "",
        createdAt: new Date().toISOString(),
      },
    });
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setState(s => ({
      ...s,
      user: s.user ? { ...s.user, ...data } : null,
    }));
  }, []);

  const deleteAccount = useCallback(() => {
    // TODO: Replace with Supabase auth.admin.deleteUser or RPC
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
