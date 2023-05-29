"use client";
import Chat from "@/components/Chat";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import withAuth from "./auth/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "./firebase";

const HomePage = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!user && !loading) router.push("/login");
    if (!loading) setPageLoading(false);
  }, [user, loading, router]);

  if (pageLoading)
    return (
      <div className="text-3xl font-bold h-screen flex justify-center items-center text-center">
        Junye is loading...
      </div>
    );
  return (
    pageLoading || (
      <div className=" h-screen flex items-center justify-center">
        <div className="border-2 border-solid rounded-lg h-[80%] w-[90%] md:w-[65%] flex">
          <div className="w-1/3 bg-green4">
            <Sidebar />
          </div>
          <div className=" w-2/3 bg-green2">
            {" "}
            <Chat />
          </div>
        </div>
      </div>
    )
  );
};

export default HomePage;
