"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const withAuth = (Component) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
      return onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push("/login");
        } else {
          setLoading(false);
        }
      });
    }, [auth, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
