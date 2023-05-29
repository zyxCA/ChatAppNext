"use client";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";

const Login = () => {
  const [err, setErr] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      setErr(true);
    }
  };

  return (
    <div className=" flex h-screen items-center justify-center">
      <div className="w-[30%] min-w-[300px] p-10 bg-green1 rounded-2xl flex flex-col gap-6 text-center">
        <h1 className=" text-3xl font-bold text-green-700">Junye Chat</h1>
        <h2 className="text-2xl animate-pulse text-green-800 ">Login!</h2>
        <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input type="file" id="file" className="hidden" />

          <button className=" bg-green4 p-4 rounded-2xl text-2xl  font-semibold cursor-pointer">
            Sign in
          </button>
        </form>
        <p>
          You don't have an account yet?{" "}
          <Link href={"/register"} className=" underline animate-pulse">
            Register!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
