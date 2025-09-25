"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { upload } from "@vercel/blob/client";
import { error } from "console";
import { ChangeEvent, useState } from "react";

const GenerateIMG = () => {
  const [inputValue, setInputValue] = useState("");
  const [Image, setImage] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  const HF_API_KEY = process.env.HF_API_KEY;

  const generateImg = async () => {
    if (!inputValue.trim()) return;

    // setIsLoading(true);
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
      const ImageUrl = URL.createObjectURL(blob);
      setImage(ImageUrl);
      const file = new File([blob], "generated.png", { type: "image/png" });
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      console.log(uploaded);
    }
  };

  const handleValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  return (
    <div>
      <div>
        <Button variant="ghost">X</Button>
        <span>New photo post</span>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold ">Explore AI generated images</h2>
          <h6 className="font-extralight">
            Describe what is on your mind. For best results, be specific
          </h6>
        </div>
        <div>
          <Textarea
            className="w-[398px] h-[102px]"
            placeholder="Example: Im walking in fog like Bladerunner 2049"
            onChange={(e) => handleValue(e)}
          />
          <Button className="bg-blue-500" onClick={() => generateImg()}>
            Generate
          </Button>
        </div>
      </div>
      <img src={Image} />
    </div>
  );
};

export default GenerateIMG;
