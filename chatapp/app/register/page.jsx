"use client";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import React, { useCallback, useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useAuthState } from "react-firebase-hooks/auth";

import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
const Register = () => {
  const [err, setErr] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  // const [loading, setLoading] = useState(false);
  const [fileErr, setFileErr] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileSelected(!!file); // Update the state based on whether a file is selected
  };

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileSelected) {
      // File input is required, display an error or perform necessary actions
      setFileErr(true);
      return;
    }
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    console.log(file);
    console.log(fileErr);
    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            router.push("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
    }
  };

  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (user) router.push("/");
    console.log(user);
  }, []);

  return (
    <div className=" flex relative h-screen items-center justify-center">
      {fileErr && (
        <div className="flex flex-col absolute items-center justify-center bg-red-500 p-3 rounded-xl">
          <h1>You need to upload your avatar image as well!!</h1>
          <button
            className=" bg-gray-200 px-2"
            onClick={() => setFileErr(false)}>
            I see
          </button>
        </div>
      )}
      <div className="w-[30%]  min-w-[300px] p-10 bg-green1 rounded-2xl flex flex-col gap-6 text-center">
        <h1 className=" text-3xl font-bold text-green-700">Junye Chat</h1>
        <h2 className="text-2xl animate-pulse text-green-800 ">
          Register Now!
        </h2>
        <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
          <input type="text" placeholder="display name" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label className=" flex items-center" htmlFor="file">
            <img
              className="w-10 h-10 cursor-pointer"
              src="/imgs/avatar.png"
              alt=""
            />
            <span className=" text-sm flex text-gray-500 items-center">
              <AiOutlineArrowLeft className="w-8 h-8" />
              Click and Add your avatar
            </span>
          </label>
          <button className=" bg-green4 p-4 rounded-2xl text-2xl  font-semibold cursor-pointer">
            Sign up
          </button>
          {err && <span>Something went wrong!</span>}
        </form>
        <p>
          You do have an account?{" "}
          <Link href={"/login"} className=" underline animate-pulse">
            Login!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
