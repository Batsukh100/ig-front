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
    const users = await fetch("https://ig-back.onrender.com/User", {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center p-6">
      {/* Search Bar */}
      <div className="w-full max-w-lg relative mb-8">
        <Input
          placeholder="🔍 Search for amazing people..."
          onChange={(e) => handleSearch(e)}
          className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-white/60 
                 backdrop-blur-sm shadow-md focus:outline-none focus:ring-4 
                 focus:ring-blue-300 text-gray-700 placeholder:text-gray-400 transition-all duration-300"
        />
        <div className="absolute right-4 top-3.5 text-gray-400">
          <i className="ri-search-line"></i>
        </div>
      </div>

      {/* User List */}
      <div className="w-full max-w-lg space-y-4 mb-10">
        {filterred.length > 0 ? (
          filterred.map((user) => (
            <div
              key={user?._id}
              onClick={() => push(`UserProfile/${user._id}`)}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/80 border border-gray-100 
                     shadow-md hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 
                     transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative">
                <Avatar className="w-14 h-14 border-2 border-blue-200 group-hover:border-purple-300 transition-all duration-300">
                  <AvatarImage src={user!.profilePicture!} />
                  <AvatarFallback>
                    {user?.username?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition">
                  {user?.username}
                </h3>
                <p className="text-sm text-gray-500">
                  {user?.email || "✨ New user"}
                </p>
              </div>

              <div className="text-gray-400 group-hover:text-purple-500 transition">
                <i className="ri-arrow-right-s-line text-2xl"></i>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-12 italic">
            No users found 😔 — try searching again.
          </p>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Search;
