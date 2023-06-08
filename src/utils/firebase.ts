import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAV49VVC806YMD5jlKmWbssvgd6q_PXldw",
  authDomain: "dut-chat-web.firebaseapp.com",
  projectId: "dut-chat-web",
  storageBucket: "dut-chat-web.appspot.com",
  messagingSenderId: "1017213126379",
  appId: "1:1017213126379:web:b784a3831c71cb0c88e0ae",
};

const app = firebase.initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadFile = (file, url) => {
  const storageRef = ref(storage, url);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return uploadTask;
};
export default storage;
