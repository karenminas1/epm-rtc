"use client";
import { FC } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useLocalStorage } from "@/app/hooks";

interface UserMenuProps {
  username: string;
  avatarUrl: string;
}

const UserMenu: FC<UserMenuProps> = ({ username, avatarUrl }) => {
  const [, , removeMessages] = useLocalStorage("messages", []);

  const handleSignOut = async () => {
    removeMessages();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Image
          src={avatarUrl}
          className="rounded-full"
          alt={`${username}'s avatar`}
          width="50"
          height="50"
        />
        <span className="ml-2 font-medium">{username}</span>
      </div>
      <button
        onClick={handleSignOut}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default UserMenu;
