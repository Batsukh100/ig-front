"use client";

import { Instagram } from "@/icons/image 5";
import { UseUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user } = UseUser();
  const { push } = useRouter();
  if (!user) push("/login");

  return (
    <div>
      <div>
        <Instagram />
      </div>
      <div>{user?.username}</div>
    </div>
  );
};

export default Page;
