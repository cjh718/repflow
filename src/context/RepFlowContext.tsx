import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

interface User {
  email: string;
  name: string;
  isPremium: boolean;
  streakDays: number;
  completedWorkouts: number;
}

interface RepFlowContextValue {
  user: User | null;
  token: string | null;
  isPremium: boolean;
  streakDays: number;
  completedWorkouts: number;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsPremium: (v: boolean) => void;
  setStreakDays: (v: number) => void;
  setCompletedWorkouts: (v: number) => void;
  logout: () => void;
  isReady: boolean;
}

const RepFlowContext = createContext<RepFlowContextValue | null>(null);

export function RepFlowProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [completedWorkouts, setCompletedWorkouts] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const savedToken = await SecureStore.getItemAsync("repflow_token");
        const savedUser = await SecureStore.getItemAsync("repflow_user");
        if (savedToken && savedUser) {
          const u = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(u);
          setIsPremium(u.isPremium || false);
          setStreakDays(u.streakDays || 0);
          setCompletedWorkouts(u.completedWorkouts || 0);
        }
      } catch {
        // ignore
      }
      setIsReady(true);
    }
    load();
  }, []);

  const logout = async () => {
    await SecureStore.deleteItemAsync("repflow_token");
    await SecureStore.deleteItemAsync("repflow_user");
    setUser(null);
    setToken(null);
    setIsPremium(false);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isPremium,
      streakDays,
      completedWorkouts,
      setUser,
      setToken,
      setIsPremium,
      setStreakDays,
      setCompletedWorkouts,
      logout,
      isReady,
    }),
    [user, token, isPremium, streakDays, completedWorkouts, isReady]
  );

  return (
    <RepFlowContext.Provider value={value}>
      {children}
    </RepFlowContext.Provider>
  );
}

export function useRepFlow() {
  const ctx = useContext(RepFlowContext);
  if (!ctx) throw new Error("useRepFlow must be used within RepFlowProvider");
  return ctx;
}
