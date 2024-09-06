"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useCloudStorage } from "@telegram-apps/sdk-react";

type User = {
  // Define your user properties here
  id: string;
  firstName: string;
  username?: string;
  // Add other properties as needed
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const storage = useCloudStorage(true);

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

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
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
