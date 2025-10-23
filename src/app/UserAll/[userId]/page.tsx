"use client";

import { UseUser } from "@/providers/AuthProvider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Ellipsis, Heart, MessageCircle } from "lucide-react";
import { userpostType } from "@/app/Profile/page";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import { otherProfile } from "@/app/UserProfile/[userId]/page";

const UserAll = () => {
  const params = useParams();
  const userId = params.userId;
  const { token } = UseUser();
  const { push } = useRouter();
  const [posts, setPosts] = useState<userpostType[]>([]);
  const [userData, setUserData] = useState<otherProfile>([]);

  const Postfetch = async () => {
    const res = await fetch(`http://localhost:5555/Post/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setPosts(data);
  };
  const Userfetch = async () => {
    const res = await fetch(`http://localhost:5555/User/DiffUser/${userId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setUserData(data.message);
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
      LikePosts();
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
                    src={userData?.profilePicture}
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

              <img src={post?.images[0]} />
              <div className=" ">
                <div className="flex gap-2">
                  <div onClick={() => LikePosts(post._id)}>
                    {post.like.includes(userData?._id!) ? (
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

export default UserAll;
