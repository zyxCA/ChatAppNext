"use client";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Navbar = () => {
  const [user, loading, error] = useAuthState(auth);
  const currentUser = user;
  const router = useRouter();
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Logged Out! ");
        router.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex justify-between items-center text-stone-900 bg-green5 p-2 h-14">
      <span className=" font-bold hidden md:flex">Junye Chat</span>
      <div className=" flex rounded-full object-cover items-center">
        <img
          className="w-8 h-8 rounded-full"
          src={currentUser?.photoURL || "/imgs/avatar.png"}
          alt=""
        />
        <span>{currentUser?.displayName || "Undefined"}</span>
        <button
          onClick={handleLogout}
          className="p-1 absolute bottom-2 left-0 md:static bg-green-800/50 ml-2 rounded">
          logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
