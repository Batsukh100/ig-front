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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type PostType = {
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
                <Avatar className="w-[42px] h-[42px]">
                  <AvatarImage src={post.user?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Link href={`/UserProfile/${post.user?._id!}`}>
                  <div className="font-semibold text-xs text-gray-800 hover:underline">
                    {post.user?.username}
                  </div>
                </Link>
                {post.user.followers.includes(user?._id) ? (
                  <Button onClick={() => follow(post.user._id)}>
                    Unfollow
                  </Button>
                ) : (
                  <Button onClick={() => follow(post.user._id)}>Follow</Button>
                )}
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

export default Page;
