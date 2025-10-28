"use client";

import { User, UseUser } from "@/providers/AuthProvider";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Ellipsis, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Footer from "@/app/_components/Footer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export type Com = {
  _id: string;
  comment: string[];
  postId: PostId;
  userId: UserIdType;
  createdAt: Date;
};
type PostId = {
  _id: string;
  caption: string;
  comment: string[] | null;
  images: string[];
  like: string[];
  user: User;
};
type UserIdType = {
  _id: string;
  profilePicture: string;
  username: string;
};

const Comment = () => {
  const { token, user } = UseUser();
  const [getCom, setGetCom] = useState<Com[]>([]);
  const [input, setInput] = useState("");
  const [editComment, setEditComment] = useState("");
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState<string | null>(null);
  const params = useParams();
  const { push } = useRouter();
  const myId = user?._id;
  const postId = params.postId;
  const getComment = async () => {
    const coooms = await fetch(
      `https://ig-back.onrender.com/Comment/Get/${postId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const response = await coooms.json();

    setGetCom(response);
  };
  console.log(getCom);
  console.log(postId);

  const writeComment = async () => {
    await fetch(`https://ig-back.onrender.com/Comment/Create/${postId}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        comment: input,
      }),
    });
    getComment();
    setInput("");
  };

  const DeleteComment = async (commentId: string) => {
    const res = await fetch(
      `https://ig-back.onrender.com/Comment/Delete/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      toast.success("Delete comment success");
    } else {
      toast.error("Yoow chi comment delete hiij bolohgui ym bna");
    }
    getComment();
  };

  const EditComment = async (commentId: string) => {
    const res = await fetch(
      `https://ig-back.onrender.com/Comment/Edit/${commentId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: editComment,
        }),
      }
    );
    if (res.ok) {
      toast.success("Edit comment success");
    } else {
      toast.error("Yoow chi comment edit hiij bolohgui ym bna");
    }
    getComment();
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
  };

  const handleInputEditComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditComment(value);
  };

  useEffect(() => {
    if (token) {
      getComment();
    }
  }, [token]);

  return (
    <div className="w-[380px] h-[650px] flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {getCom.map((com) => {
          const formatted = new Date(com.createdAt).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long", // e.g. October
              day: "numeric", // e.g. 28
            }
          );
          return (
            <div
              key={com._id}
              className="flex justify-between bg-gray-50 border border-gray-200 rounded-2xl p-3 hover:shadow-md transition-all duration-200"
            >
              <div className="flex gap-3">
                <Avatar className="w-[40px] h-[40px]">
                  <AvatarImage src={com.userId.profilePicture!} />
                  <AvatarFallback>
                    {com.userId.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <div
                      className="font-bold text-gray-800"
                      onClick={() => {
                        push(`/UserProfile/${com.postId._id}`);
                      }}
                    >
                      {com.userId.username}
                    </div>
                    <div className="text-gray-700  break-words">
                      {com.comment}
                    </div>
                    <div className="text-gray-700 text-sm">{formatted}</div>
                  </div>
                </div>
              </div>

              {com.userId._id === myId ? (
                <Dialog
                  open={openDialog === com._id}
                  onOpenChange={(open) => setOpenDialog(open ? com._id : null)}
                >
                  <DialogTrigger asChild>
                    <Ellipsis className="cursor-pointer hover:text-gray-600" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[320px]">
                    <DialogHeader>
                      <DialogTitle>Edit or Delete Comment</DialogTitle>
                      <DialogDescription>
                        Manage your comment actions below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      <Button
                        onClick={async () => {
                          await DeleteComment(com._id);
                          setOpenDialog(null);
                        }}
                        className="w-full"
                      >
                        Delete Comment
                      </Button>
                      <Dialog
                        open={editDialog === com._id}
                        onOpenChange={(open) =>
                          setEditDialog(open ? com._id : null)
                        }
                      >
                        <DialogTrigger>
                          <Button className="w-[320px]">Edit</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[300px]">
                          <DialogHeader>
                            <DialogTitle>Edit your comment</DialogTitle>
                            <DialogDescription>
                              Manage your comments
                            </DialogDescription>
                          </DialogHeader>
                          <Textarea
                            placeholder="comment"
                            onChange={(e) => handleInputEditComment(e)}
                          />
                          <Button
                            onClick={async () => {
                              await EditComment(com._id);
                              setOpenDialog(null);
                              setEditDialog(null);
                            }}
                          >
                            Edit post
                          </Button>
                        </DialogContent>
                      </Dialog>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="secondary"
                          className="w-full"
                          onClick={() => setOpenDialog(null)}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button hidden={true}></Button>
              )}
            </div>
          );
        })}
      </div>
      <div className="border-t border-gray-200 px-3 py-3 bg-gray-50">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Write a comment..."
            onChange={(e) => handleInput(e)}
            name="input"
            value={input}
            className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
          />
          <button
            onClick={() => writeComment()}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <Footer />
      </div>
    </div>
  );
};

export default Comment;
