"use client";

import IGI from "@/images/IG-Icon.png";
import { UseUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user } = UseUser();
  const { push } = useRouter();
  if (!user) push("/login");

  return (
    <div>
      <div>
        <img src={IGI.src} className="w-[100px] h-[34px]" />
      </div>
      <div>{user?.username}</div>
    </div>
  );
};

export default Page;
