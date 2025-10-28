"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UseUser } from "@/providers/AuthProvider";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

const GenerateIMG = () => {
  const [inputValue, setInputValue] = useState("");
  const [CaptionValue, setCaptionValue] = useState("");
  const [Image, setImage] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = UseUser();
  const { push } = useRouter();

  const HF_API_KEY = process.env.HF_API_KEY;

  const generateImg = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${HF_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: inputValue,
          parameters: {
            negative_prompt: "blurry, bad quality, distorted",
            num_inference_steps: 20,
            guidance_scale: 7.5,
          },
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const blob = await response.blob();

      const file = new File([blob], "generated.png", { type: "image/png" });
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setImage((prev) => [...prev, uploaded.url]);
      setIsLoading(false);
    }
  };

  const pushToMain = () => {
    push("/");
  };

  const createPost = async () => {
    const response = await fetch("https://ig-back.onrender.com/Post/Create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        caption: CaptionValue,
        images: Image,
      }),
    });
    if (response.ok) {
      toast.success("Your post is created");
      push("/");
    } else {
      toast.error("try again");
    }
  };

  const handleValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };
  const handleCaption = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCaptionValue(value);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8 bg-white rounded-xl shadow-2xl">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => pushToMain()}
          className="border-gray-300 shadow-lg"
        >
          ✕
        </Button>
        <span className="text-lg font-medium text-gray-700">
          New Photo Post
        </span>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900">
          Explore AI-Generated Images
        </h2>
        <p className="text-sm text-gray-500">
          Describe what is on your mind. For best results, be specific.
        </p>
      </div>
      <div className="space-y-4 shadow-md p-4 rounded-lg bg-gray-50">
        <Textarea
          className="w-full h-[100px] resize-none shadow-sm"
          placeholder="Example: I'm walking in fog like Blade Runner 2049"
          name="generateInput"
          onChange={(e) => handleValue(e)}
        />
        <Button
          className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
          onClick={() => generateImg()}
        >
          {isLoading ? "Generating..." : "Generate Image"}
        </Button>
      </div>

      {Image && (
        <div className="w-full shadow-md rounded-lg overflow-hidden">
          {Image.map((img) => {
            return (
              <img
                key={img}
                src={img}
                alt="Generated preview"
                className="w-full object-cover"
              />
            );
          })}
        </div>
      )}

      <div className="space-y-4 shadow-md p-4 rounded-lg bg-gray-50">
        <Textarea
          className="w-full h-[100px] resize-none shadow-sm"
          placeholder="Write a caption..."
          name="captionInput"
          onChange={(e) => handleCaption(e)}
        />
        <Button
          className="w-full bg-green-600 text-white hover:bg-green-700 transition-colors shadow-md"
          onClick={() => createPost()}
        >
          Create Post
        </Button>
      </div>
    </div>
  );
};

export default GenerateIMG;
