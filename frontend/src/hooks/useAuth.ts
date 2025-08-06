import { useState, useEffect } from "react";

type User = {
  email: string;
};

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    if (token && userEmail) {
      setIsLoggedIn(true);
      setUser({ email: userEmail });
    }
  }, []);

  const login = (email: string, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
    setIsLoggedIn(true);
    setUser({ email });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, login, logout };
}
