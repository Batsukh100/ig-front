"use client";

import { UseUser } from "@/providers/AuthProvider";
import { ChangeEvent, useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Edit = () => {
  const { token } = UseUser();
  const { push } = useRouter();
  const [input, setInput] = useState({
    username: "",
    bio: "",
  });

  const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") {
      setInput({ ...input, username: value });
    }
    if (name === "bio") {
      setInput({ ...input, bio: value });
    }
  };

  const editData = async () => {
    const res = await fetch("http://localhost:5555/User/EditProfile", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: input.username,
        bio: input.bio,
      }),
    });
    if (res.ok) {
      toast.success("amjilttai edit hiile");
      push("/Profile");
    } else {
      toast.error("aldaaa garlaaa");
    }
  };
  useEffect(() => {
    if (token) {
      editData();
    }
  }, [token]);

  return (
    <div>
      <div>
        <ChevronLeft
          onClick={() => {
            push("/Profile");
          }}
        />
        <div>EDIT PROFILE</div>
      </div>
      <div>
        <div>
          <p>Username</p>
          <Input
            placeholder="your new name"
            name="username"
            onChange={(e) => handleInputs(e)}
          />
        </div>
        <div>
          <p>Bio</p>
          <Input
            placeholder="your new bio"
            name="bio"
            onChange={(e) => handleInputs(e)}
          />
        </div>
        <Button className="bg-blue-500" onClick={() => editData()}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Edit;
