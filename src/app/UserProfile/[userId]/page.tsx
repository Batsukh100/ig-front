"use client";

import Footer from "@/app/_components/Footer";
import { userpostType } from "@/app/Profile/page";
import { Button } from "@/components/ui/button";
import { User, UseUser } from "@/providers/AuthProvider";
import { useParams } from "next/navigation";
import {
  Dispatch,
  JSX,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

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

type otherProfile = {
  username: ReactNode;
  profilePicture: string | Blob | undefined;
  bio: string;
  followers: string[];
  following: string[];
  setPosts: Dispatch<SetStateAction<OtherUser>>;
  userData: OtherUser;
  map(arg0: (post: any, index: any) => JSX.Element): ReactNode;
};

const Page = () => {
  const params = useParams();
  const userId = params.userId;
  const { token } = UseUser();
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
      {" "}
      <div className="flex justify-center h-[30px] border-2  ">
        {userData?.username}
        {/* {userId} */}
      </div>
      <div className="pt-10">
        <div className="flex gap-10">
          <div className="pl-4">
            <img
              src={userData?.profilePicture}
              className="w-[77px] h-[77px] rounded-full  "
            />
          </div>
          <div>
            <div className="font-bold text-xl pb-4 ">{userData?.username}</div>
            <Button>Edit profile</Button>
          </div>
        </div>
        <div>{userData?.bio}</div>
      </div>
      <div className="flex justify-around border-2 h-[60px] items-center mt-4 ">
        <div>{posts.length} Posts</div>
        <div>{userData.followers?.length} Followers</div>
        <div>{userData.following?.length} Following</div>
      </div>{" "}
      <div className="flex gap-1 flex-wrap mt-1 ">
        {posts.map((post, index) => {
          return (
            <div key={post.user._id}>
              <img src={post.images} className="w-[130px] h-[188px] " />
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default Page;
