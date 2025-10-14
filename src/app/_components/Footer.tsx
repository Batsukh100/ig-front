"use client";

import { House } from "lucide-react";
import { Search } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { CircleUser } from "lucide-react";
import { useRouter } from "next/navigation";

const Footer = () => {
  const { push } = useRouter();

  const home = () => {
    push("/");
  };

  const search = () => {
    push("/Search");
  };

  const createpost = () => {
    push("/CreatePost");
  };

  const person = () => {
    push("/Profile");
  };

  return (
    <div className="flex justify-between px-8 py-2 fixed bottom-0 w-screen bg-white ">
      <House onClick={home} />
      <Search onClick={search} />
      <SquarePlus onClick={createpost} />
      <CircleUser onClick={person} />
    </div>
  );
};

export default Footer;
