"use client";

import { Ellipsis, MessageCircle } from "lucide-react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type PostType = {
  _id: string;
  caption: string;
  comment: string[] | null;
  images: string[];
  like: string[];
  user: User;
};

const Page = () => {
  const { user, token } = UseUser();
  const { push } = useRouter();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const myId = user?._id;
  const getPostHandle = async () => {
    const allPosts = await fetch("https://ig-back.onrender.com/Post/Get", {
      method: "GET",
    });
    const getAllPosts = await allPosts.json();
    setPosts(getAllPosts);
  };

  const LikePosts = async (postId: string) => {
    await fetch(`https://ig-back.onrender.com/Post/like-toggle/${postId}`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    });

    getPostHandle();
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
    getPostHandle();
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
    getPostHandle();
  };

  useEffect(() => {
    if (token) {
      getPostHandle();
    }
  }, [token]);
  console.log(posts);

  return (
    <div>
      <Header />
      <div className="mt-10">
        {posts?.map((post, index) => (
          <div
            key={index}
            className="mt-6 border border-gray-200 bg-white rounded-2xl p-3 hover:shadow-md transition-all shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Avatar className="w-[42px] h-[42px]">
                  <AvatarImage src={post!.user!.profilePicture!} />
                  <AvatarFallback>
                    {post.user?.username?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <Link href={`/UserProfile/${post.user._id}`}>
                  <div className="font-bold text-gray-800 hover:underline">
                    {post.user?.username}
                  </div>
                </Link>
              </div>

              <div>
                {post.user._id === myId ? (
                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                      <Ellipsis
                        className="cursor-pointer hover:text-gray-600"
                        onClick={() => setOpenDialog(true)}
                      />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[320px]">
                      <DialogHeader>
                        <DialogTitle>Edit or Delete Post</DialogTitle>
                        <DialogDescription>
                          Manage your post actions below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2">
                        <Button
                          onClick={() => {
                            DeletePost(post._id);
                            setOpenDialog(false);
                          }}
                          className="w-full">
                          Delete Post
                        </Button>
                        <DialogClose asChild>
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={() => setOpenDialog(false)}>
                            Cancel
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : post.user.followers.includes(user!._id) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => follow(post.user._id)}>
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => follow(post.user._id)}>
                    Follow
                  </Button>
                )}
              </div>
            </div>
            <Carousel className="w-full rounded-xl overflow-hidden mb-3">
              <CarouselContent>
                {post.images.map((img, idx) => (
                  <CarouselItem key={idx}>
                    <img
                      src={img}
                      className="w-[400px] h-[600px] object-cover rounded-xl"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="flex items-center gap-3 mb-2 text-gray-700">
              <div
                onClick={() => LikePosts(post._id)}
                className="cursor-pointer">
                {post.like.includes(myId!) ? (
                  <Heart color="red" fill="red" />
                ) : (
                  <Heart />
                )}
              </div>
              <span>{post.like.length}</span>
              <MessageCircle
                className="cursor-pointer"
                onClick={() => push(`/Comment/${post._id}`)}
              />
              {post.comment?.length}
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-gray-800">
                {post.user?.username}
              </span>
              <span className="text-gray-700">{post.caption}</span>
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

export default Page;
