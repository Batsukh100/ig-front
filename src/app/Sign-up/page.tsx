"use client";

import IG from "@/images/IG.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { UseUser } from "@/providers/AuthProvider";
import { toast } from "sonner";

// const UserCreateType = {
//   email: { type: String, required: true },
//   password: { type: String, required: true },
//   username: { type: String, required: true },
//   bio: { type: String, required: false },
//   profilePicture: { type: String, required: false },
//   followers: [{ type: Schema.Types.ObjectId, required: true }],
//   follewing: [{ type: Schema.Types.ObjectId, required: true }],
//   updatedAt: { type: Date, default: Date.now() },
//   createdAt: { type: Date, default: Date.now() },
// };

const Page = () => {
  const { setUser } = UseUser();
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
    const response = await fetch("http://localhost:5555/User/Sign-up", {
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
    });
    if (response.ok) {
      const user = await response.json();
      setUser(user);
      // localStorage.setItem("user", JSON.stringify(user));
      toast.success("Success");
      push("/");
    }
  };

  // const goToLogin = () => {
  //   push("/Login");
  // };

  return (
    <div className="flex flex-col gap-4 justify-self-center items-center ">
      <div className="w-[300px] flex flex-col items-center gap-4 ">
        <img src={IG.src} className="w-[48px] h-[48px] " />
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
