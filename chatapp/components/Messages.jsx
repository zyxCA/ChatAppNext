import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatContext } from "@/context/ChatContext";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/app/firebase";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className=" p-2 h-[calc(100%-112px)] overflow-y-auto scroll-smooth ">
      {messages?.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
