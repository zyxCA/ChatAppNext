import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAckhBj7X1qXWF0cHPCIALsk1bykMQEdBE",
  authDomain: "chat-7bd6a.firebaseapp.com",
  projectId: "chat-7bd6a",
  storageBucket: "chat-7bd6a.appspot.com",
  messagingSenderId: "418727242416",
  appId: "1:418727242416:web:8de4844c0cba0e06a02975",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth();

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.log(error);
});
export const storage = getStorage();
export const db = getFirestore();
