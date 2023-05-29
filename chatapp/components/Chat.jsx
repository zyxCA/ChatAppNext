"use client";
import React, { useContext } from "react";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { FiMoreHorizontal, FiUserPlus } from "react-icons/fi";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "@/context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="h-full">
      <div className="h-14 flex justify-between items-center p-2 bg-[#bedebc]">
        <span className=" text-2xl">{data.user?.displayName}</span>
        <div className="flex gap-4">
          <AiOutlineVideoCamera className="h-6 w-6" />
          <FiUserPlus className="h-6 w-6" />
          <FiMoreHorizontal className="h-6 w-6" />
        </div>
      </div>

      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
