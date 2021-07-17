import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyB70GqeWOAwxaS8K5jGGp5mzCCCki3_mYU",
  authDomain: "finalproject-18bd5.firebaseapp.com",
  projectId: "finalproject-18bd5",
  storageBucket: "finalproject-18bd5.appspot.com",
  messagingSenderId: "465571331765",
  appId: "1:465571331765:web:0bd509df3634c7ecdd88fc",
  measurementId: "G-45QTWVWERS",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;