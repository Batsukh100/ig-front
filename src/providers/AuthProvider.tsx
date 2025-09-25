"use client";

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
} from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type User = {
  email: string;
  password: string;
  username: string;
  bio: string | null;
  profilePicture: string | null;
};

type ContextType = {
  login: (email: string, password: string) => Promise<void>;
  user: User | null;
  setUser: Dispatch<SetStateAction<null | User>>;
};

export const AuthContext = createContext<ContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  // const { push } = useRouter();

  useEffect(() => {
    const userItem = localStorage.getItem("user");
    if (userItem) {
      setUser(JSON.parse(userItem));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:5555/User/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if (response.ok) {
      const user = await response.json();
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Success");
    } else {
      toast.error("wrong password try again");
    }
  };

  const values = { login, user, setUser };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const UseUser = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Auth context ashiglahiig husvel zaavl provider bh ystoi ");
  }
  return authContext;
};
