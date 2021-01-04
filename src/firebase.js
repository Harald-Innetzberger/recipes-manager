import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// firebase init - add your own config here
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC21elwVkumkSwcwOjS186yq62TWxzA75M",
  authDomain: "recipesmanager-e8d2a.firebaseapp.com",
  projectId: "recipesmanager-e8d2a",
  storageBucket: "recipesmanager-e8d2a.appspot.com",
  messagingSenderId: "956402995222",
  appId: "1:956402995222:web:354242786c2f3bc52de537",
  measurementId: "G-4960MH0MQY"
};
firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore();
const auth = firebase.auth();

// collection references
const usersCollectionRef = db.collection("users");
const dessertCollectionRef = db.collection("dessert");
const mainDishCollectionRef = db.collection("main_dish");
const appetiserCollectionRef = db.collection("appetiser");

// export utils/refs
export {
  db,
  auth,
  dessertCollectionRef,
  mainDishCollectionRef,
  appetiserCollectionRef,
  usersCollectionRef
};
