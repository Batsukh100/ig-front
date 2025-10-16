"use client";

import { MessageCircle } from "lucide-react";
import { Heart } from "lucide-react";
import { User, UseUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PostType = {
  _id: string;
  caption: string;
  images: string[];
  like: string[];
  user: User;
};

const Page = () => {
  const { user, token } = UseUser();
  const { push } = useRouter();
  const [posts, setPosts] = useState<PostType[]>([]);
  if (!user) push("/Login");

  const getPostHandle = async () => {
    const allPosts = await fetch("http://localhost:5555/Post/Get", {
      method: "GET",
    });
    const getAllPosts = await allPosts.json();
    setPosts(getAllPosts);
  };

  const LikePosts = async (postId: string) => {
    const res = await fetch(
      `http://localhost:5555/Post/like-toggle/${postId}`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      }
    );

    getPostHandle();
  };

  const follow = async (FollowedUserId: string) => {
    const res = await fetch(
      `http://localhost:5555/User/Follow-toggle/${FollowedUserId}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }
    );
    if (res.ok) {
      toast.success("Amazing");
    } else {
      toast.error("What is this broo!");
    }
  };

  useEffect(() => {
    if (!token) {
      push("/Login");
      return;
    } else {
      getPostHandle();
    }
  }, [token]);
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="mt-10">
        {posts?.map((post, index) => {
          return (
            <div key={index} className="mt-6">
              <div className="flex items-center gap-2 mb-2 ">
                <img
                  src={post.user?.profilePicture}
                  className="w-[42px] h-[42px] rounded-4xl "
                />
                <Link href={`/UserProfile/${post.user?._id!}`}>
                  <div className="font-semibold text-xs text-gray-800 hover:underline">
                    {post.user?.username}
                  </div>
                </Link>
                <Button onClick={() => follow(post.user._id)}>Follow</Button>
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
                  <MessageCircle />
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

export default Page;
