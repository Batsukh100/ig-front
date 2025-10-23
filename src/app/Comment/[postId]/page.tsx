"use client";

import { User, UseUser } from "@/providers/AuthProvider";
import { useParams } from "next/navigation";
import { ChangeEvent, JSX, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type COM = {
  map(arg0: (com: any) => JSX.Element): import("react").ReactNode;
  userId: User;
};

const Comment = () => {
  const { token } = UseUser();
  const [getCom, setGetCom] = useState<COM>([]);
  const [input, setInput] = useState("");
  const params = useParams();
  const postId = params.postId;
  const getComment = async () => {
    const coooms = await fetch(`http://localhost:5555/Comment/Get/${postId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await coooms.json();

    setGetCom(response);
  };
  console.log(getCom);
  console.log(postId);

  const writeComment = async () => {
    await fetch(`http://localhost:5555/Comment/Create/${postId}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        comment: input,
      }),
    });
    getComment();
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
  };

  useEffect(() => {
    if (token) {
      getComment();
    }
  }, [token]);

  return (
    <div className="w-[380px]">
      <div>
        {getCom.map((com) => {
          return (
            <div key={com._id} className="flex mb-2 gap-2 ">
              <Avatar className="w-[42px] h-[42px]">
                <AvatarImage src={com.userId.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex gap-2 items-center">
                <div className="font-bold">{com.userId.username}</div>
                <div className=" flex flex-wrap w-[380px]">{com.comment}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 ">
        <Input
          placeholder="add your comment here..."
          onChange={(e) => handleInput(e)}
          value={input}
          className="w-[365px]"
        />
        <div className="flex justify-center mt-2">
          <Send onClick={() => writeComment()} />
        </div>
      </div>
    </div>
  );
};

export default Comment;
