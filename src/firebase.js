import firebase from "firebase";

const firebaseApp  = firebase.initializeApp({
    apiKey: "AIzaSyDcq-psmQeIGrqdomQJ6bvZapL3tMYpmrE",
    authDomain: "instagram-clone-244f9.firebaseapp.com",
    databaseURL: "https://instagram-clone-244f9.firebaseio.com",
    projectId: "instagram-clone-244f9",
    storageBucket: "instagram-clone-244f9.appspot.com",
    messagingSenderId: "530000414310",
    appId: "1:530000414310:web:fbaed08618d4a48d1a0fa7",
    measurementId: "G-CX55VRLVMB"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  
  export {db, auth, storage};