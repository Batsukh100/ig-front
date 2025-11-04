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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MyAll = () => {
  const { user, token } = UseUser();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const [Edit, setEdit] = useState<string | null>(null);
  const [input, setInput] = useState({
    caption: "",
    imgUrl: "",
  });
  const { push } = useRouter();

  const UserPost = async () => {
    const response = await fetch("https://ig-back.onrender.com/Post/Profile", {
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
    await fetch(`https://ig-back.onrender.com/Post/like-toggle/${postId}`, {
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
    const res = await fetch(
      `https://ig-back.onrender.com/Post/Delete/${postId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      toast.success("Delete post success");
    } else {
      toast.error("Yoow gg");
    }
    UserPost();
  };
  const editPost = async (postId: string) => {
    const res = await fetch(
      `https://ig-back.onrender.com/Post/EditPost/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caption: input.caption,
          imgUrl: input.imgUrl,
        }),
      }
    );
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-xl mx-auto mt-10 space-y-10 px-2 sm:px-0">
        {posts?.map((post, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar className="w-[42px] h-[42px]">
                  <AvatarImage src={user!.profilePicture!} />
                  <AvatarFallback>
                    {user?.username?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <Link href={`/Profile`}>
                  <div className="font-bold text-gray-800 hover:underline">
                    {user?.username}
                  </div>
                </Link>
              </div>
              <Dialog
                open={isOpen === post._id}
                onOpenChange={(open) => setIsOpen(open ? post._id : null)}>
                <DialogTrigger asChild>
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <Ellipsis className="w-5 h-5 text-gray-500" />
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[300px]">
                  <DialogHeader>
                    <DialogTitle>Manage Post</DialogTitle>
                    <DialogDescription>
                      Edit or delete your post: {post.caption}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3">
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        DeletePost(post._id);
                        setIsOpen(null);
                      }}>
                      Delete Post
                    </Button>
                    <Dialog
                      open={Edit === post._id}
                      onOpenChange={(open) => setEdit(open ? post._id : null)}>
                      <DialogTrigger asChild>
                        <Button className="w-full">Edit</Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[350px]">
                        <DialogHeader>
                          <DialogTitle>Edit Post</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          <Input
                            placeholder="Caption"
                            name="caption"
                            onChange={(e) => handleInput(e)}
                          />
                          <Input
                            placeholder="Image URL"
                            name="imgUrl"
                            defaultValue={post.images}
                            onChange={(e) => handleInput(e)}
                          />
                          <Button
                            className="w-full"
                            onClick={async () => {
                              await editPost(post._id);
                              setIsOpen(null);
                              setEdit(null);
                            }}>
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={() => setIsOpen(null)}>
                        Cancel
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4 rounded-xl overflow-hidden">
              <Carousel>
                <CarouselContent>
                  {post.images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <img
                        src={img}
                        className="w-full h-[400px] object-cover"
                        alt="post"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <div className="mt-4 flex items-center gap-3 text-gray-700">
              <button
                onClick={() => LikePosts(post._id)}
                className="transition transform active:scale-110">
                {post.like.includes(user!._id) ? (
                  <Heart color="red" fill="red" className="w-6 h-6" />
                ) : (
                  <Heart className="w-6 h-6" />
                )}
              </button>
              <span className="text-sm">{post.like.length}</span>
              <MessageCircle
                className="w-6 h-6"
                onClick={() => push(`/Comment/${post._id}`)}
              />
              <span className="text-sm">{post.comment?.length}</span>
            </div>
            <div className="mt-2 text-gray-800 flex gap-2">
              <span className="font-bold">{user?.username}</span>
              <span className="font-sm">{post.caption}</span>
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

export default MyAll;
