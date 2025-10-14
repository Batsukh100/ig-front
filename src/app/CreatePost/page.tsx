"use client";

import { Button } from "@/components/ui/button";
import { ScreenShot } from "@/icons/screenshot";
import { useRouter } from "next/navigation";

const CreatePost = () => {
  const { push } = useRouter();
  const pushToAI = () => {
    push("/GenerateIMG");
  };
  const pushToMain = () => {
    push("/");
  };
  return (
    <div>
      <div>
        <Button variant="ghost" onClick={pushToMain}>
          X
        </Button>
        <span>New photo post</span>
      </div>
      <div>
        <ScreenShot />
        <div className="w-[147px] h-[80px]">
          <Button className="bg-blue-600 w-[147px]">Photo library</Button>
          <Button
            className="text-blue-600   w-[147px]"
            variant="ghost"
            onClick={() => pushToAI()}
          >
            Generate with AI
          </Button>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default CreatePost;
