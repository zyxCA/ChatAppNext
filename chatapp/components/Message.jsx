import { auth } from "@/app/firebase";
import { ChatContext } from "@/context/ChatContext";
import React, { useContext, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Message = ({ message }) => {
  const [currentUser, loading, error] = useAuthState(auth);
  const { data } = useContext(ChatContext);
  const ref = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  return (
    <div
      ref={ref}
      className={`flex gap-2 mb-4  ${
        message.senderId === currentUser?.uid && "owner"
      } `}>
      <div>
        <img
          src={
            message.senderId === currentUser?.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          className="rounded-full w-8 h-8"
          alt=""
        />
        <span className="text-gray-400 text-sm">just now</span>
      </div>
      <div className="messageContent max-w-[80%] flex flex-col gap-2 mt-2 ">
        <p className=" bg-white p-6 py-2 text-sm rounded-2xl rounded-tl-none">
          {message.text}
        </p>
        {message.img && (
          <img className={message.img} src="/imgs/cat.png" alt="" />
        )}{" "}
      </div>
    </div>
  );
};

export default Message;
