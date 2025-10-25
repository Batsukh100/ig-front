"use client";

import { User, UseUser } from "@/providers/AuthProvider";
import Footer from "../_components/Footer";
import { Button } from "@/components/ui/button";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { otherProfile } from "../UserProfile/[userId]/page";

export type Post = {
  caption: string;
  images: string[];
  like: string[];
  comment: string[];
  updatedAt: Date;
  createdAt: Date;
  user: User;
};

export type userpostType = {
  like: string[];
  caption: string;
  _id: string;
  images: string | Blob;
  user: User;
  userPost: Post;
  setUserPost: Dispatch<SetStateAction<Post>>;
};

const Profile = () => {
  const { user, token } = UseUser();
  const [userPost, setUserPost] = useState<userpostType[]>([]);
  const [userData, setUserData] = useState<otherProfile>([]);
  const { push } = useRouter();
  const userId = user?._id;
  const [input, setInput] = useState({
    username: "",
    bio: "",
  });

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

  const handleInputs = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "username") {
      setInput({ ...input, username: value });
    }
    if (name === "bio") {
      setInput({ ...input, bio: value });
    }
  };

  const editData = async () => {
    const res = await fetch("http://localhost:5555/User/EditProfile", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: input.username,
        bio: input.bio,
      }),
    });
    if (res.ok) {
      toast.success("amjilttai edit hiile");
      push("/Profile");
    } else {
      toast.error("aldaaa garlaaa");
    }
    Userfetch();
  };

  useEffect(() => {
    if (!token) {
      push("/Login");
    }
    UserPost();
    Userfetch();
  }, [token]);

  return (
    <div>
      <div className="flex justify-center h-[30px] border-2 sticky ">
        {userData?.username}
      </div>
      <div className="pt-10">
        <div className="flex gap-10">
          <div className="pl-4">
            <img
              src={userData?.profilePicture!}
              className="w-[77px] h-[77px] rounded-full  "
            />
          </div>
          <div>
            <div className="font-bold text-xl pb-4 ">{userData?.username}</div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit your profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you are
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    placeholder={userData?.username}
                    className="border px-3 py-2 rounded-md"
                    onChange={(e) => handleInputs(e)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder={userData?.bio}
                    className="border px-3 py-2 rounded-md"
                    onChange={(e) => handleInputs(e)}
                  />
                </div>

                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button onClick={() => editData()}>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div>{userData?.bio}</div>
      </div>

      <div className="flex justify-around border-2 h-[60px] items-center  ">
        <div>{userPost.length} Posts</div>
        <div>{user?.followers.length} Followers</div>
        <div>{user?.following.length} Following</div>
      </div>
      <div className="flex gap-1  flex-wrap ">
        {userPost.map((post) => {
          return (
            <div
              key={post._id}
              onClick={() => {
                push("/MyAll");
              }}
            >
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
