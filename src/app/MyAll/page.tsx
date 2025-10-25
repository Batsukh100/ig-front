"use client";

import { UseUser } from "@/providers/AuthProvider";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../_components/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { PostType } from "../page";
import Footer from "../_components/Footer";
import { Ellipsis } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const MyAll = () => {
  const { user, token } = UseUser();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [input, setInput] = useState({
    caption: "",
    imgUrl: "",
  });
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
    await fetch(`http://localhost:5555/Post/like-toggle/${postId}`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    });
    UserPost();
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (name === "caption") {
      setInput({ ...input, caption: value });
    }
    if (name === "imgUrl") {
      setInput({ ...input, imgUrl: value });
    }
  };

  const DeletePost = async (postId: string) => {
    const res = await fetch(`http://localhost:5555/Post/Delete/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      toast.success("Delete post success");
    } else {
      toast.error("Yoow gg");
    }
    UserPost();
  };
  const editPost = async (postId: string) => {
    const res = await fetch(`http://localhost:5555/Post/EditPost/${postId}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        caption: input.caption,
        imgUrl: input.imgUrl,
      }),
    });
    if (res.ok) {
      toast.success("Edit post success");
    } else {
      toast.error("gg aldaa garlaa ");
    }
    UserPost();
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
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 mb-2 ">
                  <img
                    src={user!.profilePicture!}
                    className="w-[42px] h-[42px] rounded-4xl "
                  />
                  <Link href={`/Profile`}>
                    <div className="font-semibold text-xs text-gray-800 hover:underline">
                      {user?.username}
                    </div>
                  </Link>
                </div>
                <Dialog open={isOpen2} onOpenChange={setIsOpen2}>
                  <DialogTrigger asChild>
                    <Ellipsis />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[300px]">
                    <DialogHeader>
                      <DialogTitle>Edit and Delete your post</DialogTitle>
                      <DialogDescription>
                        {" "}
                        Tanii edit hiih post {post.caption}
                      </DialogDescription>
                    </DialogHeader>
                    <Button
                      onClick={() => {
                        DeletePost(post._id);
                        setIsOpen2(false);
                      }}
                    >
                      Delete Post
                    </Button>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger>
                        <Button className="w-[320px]">Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[300px]">
                        <DialogHeader>
                          <DialogTitle>Edit your post</DialogTitle>
                          <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <Input
                          placeholder="caption"
                          name="caption"
                          onChange={(e) => handleInput(e)}
                        />
                        <Input
                          placeholder="image-url"
                          name="imgUrl"
                          defaultValue={post.images}
                          onChange={(e) => handleInput(e)}
                        />
                        <Button
                          onClick={async () => {
                            await editPost(post._id);
                            setIsOpen(false);
                            setIsOpen2(false);
                          }}
                        >
                          Edit post
                        </Button>
                      </DialogContent>
                    </Dialog>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>

              <img src={post?.images[0]} />
              <div className=" ">
                <div className="flex gap-2">
                  <div onClick={() => LikePosts(post._id)}>
                    {post.like.includes(user!._id) ? (
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
                  <div className="font-semibold ">{user?.username}</div>
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
