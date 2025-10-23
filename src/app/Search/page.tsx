"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { UseUser, User } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Footer from "../_components/Footer";

const Search = () => {
  const { token } = UseUser();
  const [search, setSearch] = useState("");
  const [Users, setUsers] = useState<User[]>([]);
  const { push } = useRouter();

  const AllUser = async () => {
    const users = await fetch("http://localhost:5555/User", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const allUsers = await users.json();
    setUsers(allUsers);
  };

  useEffect(() => {
    if (token) {
      AllUser();
    }
  }, [token]);

  const filterred = Users.filter((user) => {
    return user.username.toLowerCase().includes(search.toLowerCase());
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };
  return (
    <div>
      <div>
        <Input
          placeholder="Search"
          onChange={(e) => handleSearch(e)}
          className="search-input p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="mb-10">
        {filterred.map((user) => {
          return (
            <div
              key={user?._id}
              className="flex gap-2 mb-2 border-2 border-grey rounded-xl shadow-lg items-center ">
              <Avatar className="w-[42px] h-[42px]">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div
                onClick={() => {
                  push(`UserProfile/${user._id}`);
                }}
                className="flex justify-center">
                {user?.username}
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default Search;
