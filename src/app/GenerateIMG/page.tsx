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
  const [Image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = UseUser();
  const { push } = useRouter();

  const HF_API_KEY = process.env.HF_API_KEY

  const generateImg = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setImage("");
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
      setImage(uploaded.url);
      console.log(uploaded);
    }
  };

  const pushToMain = () => {
    push("/");
  };

  const createPost = async () => {
    const response = await fetch("http://localhost:5555/Post/Create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        caption: CaptionValue,
        images: [Image],
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
    <div>
      <div>
        <Button variant="ghost" onClick={() => pushToMain()}>
          X
        </Button>
        <span>New photo post</span>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold ">Explore AI generated images</h2>
          <h6 className="font-extralight">
            Describe what is on your mind. For best results, be specific
          </h6>
        </div>
        <div className=" flex flex-col items-center">
          <Textarea
            className="w-[398px] h-[102px]"
            placeholder="Example: Im walking in fog like Bladerunner 2049"
            name="generateInput"
            onChange={(e) => handleValue(e)}
          />
          <Button className="bg-blue-500 " onClick={() => generateImg()}>
            {isLoading === true ? "Generating" : "Generate"}
          </Button>
        </div>
      </div>
      <img src={Image} />
      <div className=" flex flex-col items-center">
        <Textarea
          className="w-[398px] h-[102px]  "
          placeholder="Your caption area"
          name="captionInput"
          onChange={(e) => handleCaption(e)}
        />
        <Button onClick={() => createPost()}> Create Post</Button>
      </div>
    </div>
  );
};

export default GenerateIMG;
