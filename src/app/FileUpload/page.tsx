"use client";
import { ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upload } from "@vercel/blob/client";
import { ChangeEvent, useState } from "react";
import { UseUser } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const FileUpload = () => {
  const { token } = UseUser();
  const [file, setFile] = useState<File | null>(null);
  const [CaptionValue, setCaptionValue] = useState("");
  const [img, setImg] = useState<string[]>([]);
  const { push } = useRouter();
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };
  const Uploaded = async () => {
    if (!file) return;

    const uploaded = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
    setImg((prev) => [...prev, uploaded.url]);
  };
  console.log(file);

  const createPost = async () => {
    const response = await fetch("http://localhost:5555/Post/Create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        caption: CaptionValue,
        images: img,
      }),
    });
    if (response.ok) {
      toast.success("Your post is created");
      push("/");
    } else {
      toast.error("try again");
    }
  };
  const handleCaption = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCaptionValue(value);
  };

  return (
    <div>
      <div className="flex">
        <Input type="file" accept="image/*" onChange={(e) => handleFile(e)} />
        <Button onClick={() => Uploaded()}>upload</Button>
      </div>
      <p className="font-bold">Your image:</p>
      {""}
      <div className="w-full">
        {img.map((image, index) => {
          return (
            <div key={index}>
              <img src={image} />
            </div>
          );
        })}
      </div>
      <Textarea placeholder="caption" onChange={(e) => handleCaption(e)} />
      <Button onClick={() => createPost()}>Post</Button>
    </div>
  );
};

export default FileUpload;
