"use client";

import { Button } from "@/components/ui/button";
import { ScreenShot } from "@/icons/screenshot";
import { useRouter } from "next/navigation";

const CreatePost = () => {
  const { push } = useRouter();

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => push("/")}
          className="border-gray-400 shadow-lg rounded-2xl"
        >
          ✕
        </Button>
        <h2 className="text-lg font-semibold">New Photo Post</h2>
        <div className="w-10" /> {/* Empty space for alignment */}
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center flex-1">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm flex flex-col items-center gap-6">
          <ScreenShot />

          <div className="flex flex-col gap-4 w-full">
            <Button className="bg-blue-600 text-white shadow-md hover:shadow-lg transition">
              Photo Library
            </Button>
            <Button
              variant="ghost"
              className="text-blue-600 w-full shadow-sm hover:shadow-md transition"
              onClick={() => push("/GenerateIMG")}
            >
              Generate with AI
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;
