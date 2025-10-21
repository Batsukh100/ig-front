"use client";

import { UseUser } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { userpostType } from "../Profile/page";
import { useRouter } from "next/navigation";
import Header from "../_components/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { PostType } from "../page";
import Footer from "../_components/Footer";
import { Ellipsis } from "lucide-react";

const MyAll = () => {
  const { user, token } = UseUser();
  const [posts, setPosts] = useState<PostType[]>([]);
  const { push } = useRouter();

  const UserPost = async () => {
    const response = await fetch("http://localhost:5555/Post/Profile", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setPosts(data);
  };

  const LikePosts = async (postId: string) => {
    const res = await fetch(
      `http://localhost:5555/Post/like-toggle/${postId}`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      }
    );
  };

  useEffect(() => {
    if (token) {
      UserPost();
    }
  }, [token]);

  console.log(posts);
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="mt-10">
        {posts?.map((post, index) => {
          return (
            <div key={index} className="mt-6">
              <div>
                <div className="flex items-center gap-2 mb-2 ">
                  <img
                    src={user?.profilePicture}
                    className="w-[42px] h-[42px] rounded-4xl "
                  />
                  <Link href={`/Profile`}>
                    <div className="font-semibold text-xs text-gray-800 hover:underline">
                      {user?.username}
                    </div>
                  </Link>
                </div>
                <Ellipsis />
              </div>

              <img src={post?.images[0]} />
              <div className=" ">
                <div className="flex gap-2">
                  <div onClick={() => LikePosts(post._id)}>
                    {post.like.includes(user?._id!) ? (
                      <Heart color="red" fill="red" />
                    ) : (
                      <Heart />
                    )}
                  </div>
                  {post?.like.length}
                  <MessageCircle
                    onClick={() => {
                      push(`/Comment/${post._id}`);
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="font-semibold ">{post.user?.username}</div>
                  {"  "}
                  <div>{post?.caption}</div>
                </div>
              </div>
              <div className="border w-full border-black"></div>
            </div>
          );
        })}
      </div>
      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default MyAll;
