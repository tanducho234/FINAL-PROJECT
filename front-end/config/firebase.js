// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {  getFirestore, collection, query, orderBy, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBv-FHxwwFlnh30CVQAcWivf48-zoojyjQ",
  authDomain: "final-project-ad786.firebaseapp.com",
  databaseURL: "https://final-project-ad786-default-rtdb.firebaseio.com",
  projectId: "final-project-ad786",
  storageBucket: "final-project-ad786.appspot.com",
  messagingSenderId: "12553932361",
  appId: "1:12553932361:web:322aee87819cc713cdb998",
};

// Initialize Firebase
// const db = firebase.initializeApp(firebaseConfig);
// console.log("bbb",db);
// console.log(db);
const firebaseApp = initializeApp(firebaseConfig);
    // console.log("Firebase app initialized", firebaseApp);
    const firestore = getFirestore(firebaseApp);
export default firestore;