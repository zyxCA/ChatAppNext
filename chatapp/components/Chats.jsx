"use client";
import { auth, db } from "@/app/firebase";
import { ChatContext } from "@/context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [currentUser, loading, error] = useAuthState(auth);
  const { dispatch } = useContext(ChatContext);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };
    currentUser?.uid && getChats();
  }, [currentUser?.uid]);
  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };
  return (
    <div className="">
      {chats &&
        Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <div
              className="p-2 flex items-center cursor-pointer hover:bg-[#bedebc]"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}>
              <img
                src={chat[1].userInfo?.photoURL}
                className="h-14 w-14 bg-white rounded-full mr-2"
                alt=""
              />
              <div>
                <span className=" text-lg font-bold">
                  {chat[1].userInfo?.displayName}
                </span>
                <p className=" text-md font-normal">
                  {chat[1].lastMessage?.text}
                </p>
              </div>
            </div>
          ))}
    </div>
  );
};

export default Chats;
