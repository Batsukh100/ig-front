"use client";

import { UseUser } from "@/providers/AuthProvider";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Comment = () => {
  const { token } = UseUser();
  const [getCom, setGetCom] = useState([]);
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

    console.log(coooms);

    const response = await coooms.json();
    console.log(response, "res");

    setGetCom(response);
  };
  // console.log(postId);
  console.log(getCom);

  const writeComment = async () => {
    const create = await fetch(
      `http://localhost:5555/Comment/Create/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: input,
        }),
      }
    );
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
            <div className="flex mb-2 ">
              <Avatar>
                <AvatarImage src={com.userId.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <div className="font-bold">{com.userId.username}</div>
                <div className=" flex flex-wrap w-[380px]">{com.comment}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="add your comment here..."
          onChange={(e) => handleInput(e)}
          value={input}
        />
        <div className="flex justify-center mt-2">
          <Send onClick={() => writeComment()} />
        </div>
      </div>
    </div>
  );
};

export default Comment;
