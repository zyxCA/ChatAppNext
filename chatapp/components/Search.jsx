"use client";
import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../app/firebase";
import { AuthContext } from "../context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../app/firebase";
import { doc, getDoc } from "firebase/firestore";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const [currentUser, loading, error] = useAuthState(auth);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      console.log(1);
      if (!res.exists()) {
        //create a chat in chats collection
        console.log(2);
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        console.log(3);
        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        console.log(4);
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        console.log(111);
      }
    } catch (err) {
      console.log("something wrong");
    }

    setUser(null);
    setUsername("");
  };

  return (
    <div className="border-b-2 ">
      <div className="p-2 ">
        <input
          type="text"
          placeholder="find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          className="p-0 bg-transparent outline-none placeholder-gray-200"
          value={username}
        />
      </div>
      {err && <span>user not found</span>}
      {user && (
        <div
          className="p-2 flex items-center cursor-pointer hover:bg-[#bedebc]"
          onClick={handleSelect}>
          <img
            src={user.photoURL}
            className="h-14 w-14 bg-white rounded-full mr-2"
            alt=""
          />
          <div>
            <span className=" text-lg font-bold">{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
