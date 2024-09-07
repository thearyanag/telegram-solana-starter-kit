"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useCloudStorage } from "@telegram-apps/sdk-react";

type User = {
  public_key: string;
  session: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => void;
  authStatus: string;
  setAuthStatus: (status: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const storage = useCloudStorage();
  const [authStatus, setAuthStatus] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!storage) return;
        const storedUser = await storage.get("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = () => {
    setUser(null);
    storage.delete("user");
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, logout, authStatus, setAuthStatus }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
