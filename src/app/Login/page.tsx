"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { IGIcon } from "@/icons/IgIcon";

const Login = () => {
  const { login, user } = UseUser();
  const { push } = useRouter();

  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });

  const HandleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setInputValues({ ...inputValues, email: value });
    }
    if (name === "password") {
      setInputValues({ ...inputValues, password: value });
    }
  };

  const goToSignUp = () => {
    push("/Sign-up");
  };

  const handleLogin = async () => {
    await login(inputValues.email, inputValues.password);
  };
  useEffect(() => {
    if (user) push("/");
  }, [user]);

  return (
    <div className="flex flex-col items-center gap-5 border-2 border-solid border-e-white shadow-lg justify-center m-2 mt-10">
      <IGIcon />
      <div className="flex flex-col gap-4 item-center justify-center ">
        <div className="w-[300px]">
          <Input
            placeholder="Email"
            name="email"
            type="email"
            onChange={(e) => HandleInputs(e)}
          />
          <Input
            placeholder="Password"
            name="password"
            type="password"
            onChange={(e) => HandleInputs(e)}
          />
        </div>
        <div>
          <Button
            className="w-[300px] bg-blue-400 "
            variant="ghost"
            onClick={handleLogin}
          >
            Log in
          </Button>
        </div>
      </div>
      <div className="flex">
        <Label>Do not have an account </Label>
        <Button
          variant="ghost"
          className="text-blue-400"
          onClick={() => goToSignUp()}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default Login;
