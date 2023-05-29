"use client";
import { auth, db, storage } from "@/app/firebase";
import { ChatContext } from "@/context/ChatContext";
import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import React, { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { v4 as uuid } from "uuid";

import { BsPaperclip, BsFillImageFill } from "react-icons/bs";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [currentUser, loading, error] = useAuthState(auth);
  const { data } = useContext(ChatContext);
  const handleSend = async () => {
    console.log(data.chatId);
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          console.log("start to update");
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
          console.log("failed update");
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className="h-14   flex justify-between items-center">
      <div className=" bg-white w-full h-full p-2 flex justify-between items-center">
        <input
          type="text"
          className="h-8 w-full border-none  outline-none text-base"
          placeholder="Type something..."
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="flex items-center gap-2 ">
          <BsPaperclip className="w-6 h-6 cursor-pointer" />{" "}
          <input
            type="file"
            className=" hidden"
            id="file"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <label htmlFor="file">
            <BsFillImageFill className="w-6 h-6 cursor-pointer" />
          </label>
        </div>
      </div>
      <button
        onClick={handleSend}
        className="bg-green3  h-full  px-3 hover:bg-green5 rounded-md">
        Send
      </button>
    </div>
  );
};

export default Input;
