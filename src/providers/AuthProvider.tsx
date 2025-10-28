"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
} from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export type User = {
  _id: string;
  email: string;
  password: string;
  username: string;
  bio: string | null;
  profilePicture: string | null;
  followers: string[];
  following: string[];
};

type ContextType = {
  login: (email: string, password: string) => Promise<void>;
  user: User | null;
  setUser: Dispatch<SetStateAction<null | User>>;
  setToken: Dispatch<SetStateAction<null | string>>;
  token: string | null;
};

export type decodedTokenType = {
  data: User;
};

export const AuthContext = createContext<ContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { push } = useRouter();

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (typeof window !== undefined) {
      if (localToken) {
        setToken(localToken);
        const decodedToken: decodedTokenType = jwtDecode(localToken);
        setUser(decodedToken.data);
        // push("/");
      } else {
        push("/Login");
      }
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
      const token = await response.json();
      localStorage.setItem("token", token);
      const decodedToken: decodedTokenType = jwtDecode(token);
      setUser(decodedToken.data);
      toast.success("Success");
    } else {
      toast.error("wrong password try again");
    }
  };

  const values = { login, user, setUser, token, setToken };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const UseUser = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Auth context ashiglahiig husvel zaavl provider bh ystoi ");
  }
  return authContext;
};
