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
  const { token, user } = UseUser();
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-xl mx-auto mt-10 px-3 space-y-10">
        {posts?.map((post, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={userData?.profilePicture ?? ""}
                  alt="profile"
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
                <Link href={`/UserProfile/${userData?._id}`}>
                  <div className="font-semibold text-sm text-gray-800 hover:underline">
                    {userData?.username}
                  </div>
                </Link>
              </div>

              <button className="p-1 hover:bg-gray-100 rounded-full transition">
                <Ellipsis className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="mt-4 rounded-xl overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {post.images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <img
                        src={img}
                        alt={`post-${idx}`}
                        className="w-[400px] h-[600px] object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <div className="mt-4 flex items-center gap-4 text-gray-700">
              <button
                onClick={() => LikePosts(post._id)}
                className="transition transform active:scale-110">
                {post.like.includes(user!._id!) ? (
                  <Heart className="w-6 h-6" color="red" fill="red" />
                ) : (
                  <Heart className="w-6 h-6" />
                )}
              </button>
              <span className="text-sm">{post?.like.length}</span>
              <MessageCircle
                className="w-6 h-6"
                onClick={() => push(`/Comment/${post._id}`)}
              />
            </div>
            <div className="mt-3 flex gap-2 text-gray-800">
              <span className="font-bold">{userData?.username}</span>
              <span className="text-grey-700">{post?.caption}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default UserAll;
