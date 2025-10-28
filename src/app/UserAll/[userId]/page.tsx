"use client";

import { User, UseUser } from "@/providers/AuthProvider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Ellipsis, Heart, MessageCircle } from "lucide-react";
import { userpostType } from "@/app/Profile/page";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
const UserAll = () => {
  const params = useParams();
  const userId = params.userId;
  const { token } = UseUser();
  const { push } = useRouter();
  const [posts, setPosts] = useState<userpostType[]>([]);
  const [userData, setUserData] = useState<User | null>(null);

  const Postfetch = async () => {
    const res = await fetch(
      `https://ig-back.onrender.com/Post/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    setPosts(data);
  };
  const Userfetch = async () => {
    const res = await fetch(
      `https://ig-back.onrender.com/User/DiffUser/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    setUserData(data.message);
  };

  const LikePosts = async (postId: string) => {
    await fetch(`https://ig-back.onrender.com/Post/like-toggle/${postId}`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    });
  };

  useEffect(() => {
    if (token) {
      Postfetch();
      Userfetch();
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
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 mb-2 ">
                  <img
                    src={userData?.profilePicture ?? ""}
                    className="w-[42px] h-[42px] rounded-4xl "
                  />
                  <Link href={`/Profile`}>
                    <div className="font-semibold text-xs text-gray-800 hover:underline">
                      {userData?.username}
                    </div>
                  </Link>
                </div>
                <Ellipsis />
              </div>

              <Carousel className="w-full rounded-xl overflow-hidden mb-3">
                <CarouselContent>
                  {post.images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <img
                        src={img}
                        className="w-full h-[400px] object-cover rounded-xl"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              <div>
                <div className="flex gap-2">
                  <div onClick={() => LikePosts(post._id)}>
                    {post.like.includes(userData!._id!) ? (
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
                  <div className="font-semibold ">{userData?.username}</div>
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

export default UserAll;
