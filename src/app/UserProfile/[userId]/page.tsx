"use client";

import Footer from "@/app/_components/Footer";
import { userpostType } from "@/app/Profile/page";
import { Button } from "@/components/ui/button";
import { UseUser } from "@/providers/AuthProvider";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

export type OtherUser = {
  _id: string;
  email: string;
  password: string;
  username: string;
  bio: string | null;
  profilePicture: string | null;
  followers: string[];
  following: string[];
};

export type otherProfile = {
  _id: string;
  username: string;
  profilePicture: string | null;
  bio: string;
  followers: string[];
  following: string[];
  setPosts: Dispatch<SetStateAction<OtherUser>>;
  userData: OtherUser;
};

const Page = () => {
  const params = useParams();
  const userId = params.userId;
  const { token, user } = UseUser();
  const { push } = useRouter();
  const [posts, setPosts] = useState<userpostType[]>([]);
  const [userData, setUserData] = useState<otherProfile | null>(null);

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

  const follow = async (FollowedUserId: string) => {
    const res = await fetch(
      `https://ig-back.onrender.com/User/Follow-toggle/${FollowedUserId}`,
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
    Userfetch();
  };

  useEffect(() => {
    if (token) {
      Userfetch();
      Postfetch();
    }
  }, [token]);

  console.log(posts);
  console.log(userData);

  return (
    <div>
      <div className="flex justify-center h-[30px] border-2 font-bold text-xl">
        {userData?.username}
      </div>
      <div className="pt-6">
        <div className="flex gap-10">
          <div className="pl-4">
            <img
              src={userData?.profilePicture ?? ""}
              className="w-[77px] h-[77px] rounded-full  "
            />
          </div>
          <div className="font-bold text-xl pb-4 ">{userData?.username}</div>
        </div>
        <div className="text-lg font-semibold">{userData?.bio}</div>
        <div className="flex pt-4">
          {userData?.followers.includes(user!._id) ? (
            <Button
              className="w-[200px]"
              variant="secondary"
              onClick={() => follow(user!._id)}>
              Unfollow
            </Button>
          ) : (
            <Button className="w-[200px]" onClick={() => follow(user!._id)}>
              Follow
            </Button>
          )}
          <Button className="w-[200px]">Message</Button>
        </div>
      </div>
      <div className="flex justify-around border-2 h-[60px] items-center mt-4 ">
        <div>{posts.length} Posts</div>
        <div>{userData?.followers?.length} Followers</div>
        <div>{userData?.following?.length} Following</div>
      </div>{" "}
      <div className="flex flex-wrap ">
        {posts.map((post) => {
          return (
            <div
              key={post._id}
              onClick={() => {
                push(`/UserAll/${userId}`);
              }}>
              <img src={post?.images?.[0]} className="w-[130px] h-[190px]" />
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default Page;
