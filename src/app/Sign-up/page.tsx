"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { UseUser } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { IGIcon } from "@/icons/IgIcon";
import { jwtDecode } from "jwt-decode";

import { decodedTokenType } from "@/providers/AuthProvider";

const Page = () => {
  const { setUser, setToken } = UseUser();
  const [userCreate, setUserCreate] = useState({
    email: "",
    password: "",
    username: "",
    bio: "",
    profilePicture: "",
    follewers: [],
    following: [],
  });

  const { push } = useRouter();

  const handleCreate = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setUserCreate({ ...userCreate, email: value });
    }
    if (name === "password") {
      setUserCreate({ ...userCreate, password: value });
    }
    if (name === "username") {
      setUserCreate({ ...userCreate, username: value });
    }
  };

  const HandleUserCreate = async () => {
    const response = await fetch(
      "https://ig-back.onrender.com/User/Sign-up",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userCreate.email,
          password: userCreate.password,
          username: userCreate.username,
          bio: userCreate.bio,
          profilePicture: userCreate.profilePicture,
          followers: userCreate.follewers,
          following: userCreate.following,
        }),
      }
    );
    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);
      setToken(token);
      const decodedToken: decodedTokenType = jwtDecode(token);
      setUser(decodedToken.data);
      toast.success("Success");
      push("/");
    } else {
      toast.error("Try harder");
    }
  };

  // const goToLogin = () => {
  //   push("/Login");
  // };

  return (
    <div className="flex flex-col gap-4 justify-self-center items-center ">
      <div className="w-[300px] flex flex-col items-center gap-4 ">
        <IGIcon />
        <Label>Sign up to see photos and videos from your friends</Label>
      </div>
      <div className="w-[300px] flex flex-col ">
        <Input
          placeholder="Email"
          name="email"
          onChange={(e) => handleCreate(e)}
        ></Input>
        <Input
          placeholder="Password"
          name="password"
          onChange={(e) => handleCreate(e)}
        ></Input>
        <Input
          placeholder="Username"
          name="username"
          onChange={(e) => handleCreate(e)}
        ></Input>
      </div>
      <Button
        className="w-[300px] bg-blue-400 "
        variant="secondary"
        onClick={HandleUserCreate}
      >
        Sign up
      </Button>
      <div className="flex">
        <Label>Have an account?</Label>
        <Button
          variant="ghost"
          className="text-blue-600"
          // onClick={() => goToLogin()}
        >
          Log in
        </Button>
      </div>
    </div>
  );
};

export default Page;
