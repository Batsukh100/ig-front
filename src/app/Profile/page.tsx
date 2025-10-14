"use client";

import { User, UseUser } from "@/providers/AuthProvider";
import Footer from "../_components/Footer";
import { Button } from "@/components/ui/button";
import {
  Dispatch,
  JSX,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export type Post = {
  map(arg0: (post: any, index: any) => any): import("react").ReactNode;
  caption: string;
  images: [string];
  like: [number];
  comment: [number];
  updatedAt: Date;
  createdAt: Date;
  user: User;
};

export type userpostType = {
  images: string;
  user: User;
  map(arg0: (post: any, index: any) => JSX.Element): ReactNode;
  userPost: Post;
  setUserPost: Dispatch<SetStateAction<Post>>;
};

const Profile = () => {
  const { user, token } = UseUser();
  const [userPost, setUserPost] = useState<userpostType[]>([]);
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
    setUserPost(data);
  };

  useEffect(() => {
    if (!token) {
      push("/Login");
    }
    UserPost();
  }, [token]);

  return (
    <div>
      <div className="flex justify-center h-[30px] border-2 sticky ">
        {user?.username}
      </div>
      <div className="pt-10">
        <div className="flex gap-10">
          <div className="pl-4">
            <img
              src={user?.profilePicture}
              className="w-[77px] h-[77px] rounded-full  "
            />
          </div>
          <div>
            <div className="font-bold text-xl pb-4 ">{user?.username}</div>
            <Button>Edit profile</Button>
          </div>
        </div>
        <div>{user?.bio}</div>
      </div>

      <div className="flex justify-around border-2 h-[60px] items-center  ">
        <div>{userPost.length} Posts</div>
        <div>{user?.followers.length} Followers</div>
        <div>{user?.following.length} Following</div>
      </div>
      <div className="flex gap-1  flex-wrap ">
        {userPost.map((post, index) => {
          return (
            <div key={post.user._id}>
              <img src={post.images} className="w-[130px] h-[188px] " />
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

export default Profile;

//  <div>
//         <div></div>
//         <div></div>
//         <div></div>
//       </div>
//       <div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//       </div>
