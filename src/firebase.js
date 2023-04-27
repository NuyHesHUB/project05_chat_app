/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
/* import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; */

/* 추가 */
/* import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage"; */
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/* const firebaseConfig = {
  apiKey: "AIzaSyBXTKRnwH7EPADucHVvnEy3bRItzyC9FZ4",
  authDomain: "project-chat-app-8bf07.firebaseapp.com",
  projectId: "project-chat-app-8bf07",
  storageBucket: "project-chat-app-8bf07.appspot.com",
  messagingSenderId: "389288435908",
  appId: "1:389288435908:web:5730014d767d9b0138a991",
  measurementId: "G-38VNCMNRM8"
}; */

// Initialize Firebase
/* const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app; */




/* firebase.initializeApp(firebaseConfig);

let auth_obj = firebase.auth();
let storage_obj = firebase.storage();

export default firebase;
export const auth = auth_obj;
export const storage = storage_obj; */

// import firebase from "firebase/app";
import { initializeApp } from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
//
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyBXTKRnwH7EPADucHVvnEy3bRItzyC9FZ4",
  authDomain: "project-chat-app-8bf07.firebaseapp.com",
  projectId: "project-chat-app-8bf07",
  storageBucket: "project-chat-app-8bf07.appspot.com",
  messagingSenderId: "389288435908",
  appId: "1:389288435908:web:5730014d767d9b0138a991",
  measurementId: "G-38VNCMNRM8"
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);

export default app;




