import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import firebase from "../utils/firebase";
import "../css/reg.css";
import img2 from "../components/images/img2.png";

export default function Registration() {
  const [uservalue, setUservalue] = useState({
    email: "",
    name: "",
    password: "",
    confirmpass: "",
  });
  const history = useHistory();

  const db = firebase.firestore();

  const handleChange = (prop) => (e) => {
    setUservalue({ ...uservalue, [prop]: e.target.value });
  };
  const register = (e) => {
    e.preventDefault();

    if (!uservalue.email || !uservalue.password || !uservalue.confirmpass) {
      alert("Please complete all fields");
    } else if (uservalue.password !== uservalue.confirmpass) {
      alert("Password do not match!");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(uservalue.email, uservalue.password)
        .then((userCredential) => {
          // Signed in
          //var user = userCredential.user;
          // ...
          const currentUser = firebase.auth().currentUser;
          db.collection("users")
            .doc(currentUser.uid)
            .set({
              s: "",
            })
            .then((docRef) => {
              //success
            })
            .catch((error) => {
              //error
            });

          db.collection("users")
            .doc(currentUser.uid)
            .collection("profile")
            .add({
              email: currentUser.email,
              name: uservalue.name,
              img: "",
            });

          alert("Account register & Signed in!");
          history.push("/home");
        })
        .catch((error) => {
          //var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
          // ..
        });
    }
  };

  return (
    <div className="container2">
      <div className="column1">
        <img src={img2} alt="" className="img2" /> <br></br>
        <form>
          <label for="email"></label>
          <input
            type="text"
            name="email"
            className="txt1"
            placeholder=" Email"
            onChange={handleChange("email")}
            value={uservalue.email}
          />
          <label for="name"></label>
          <input
            type="text"
            name="name"
            className="txt1"
            placeholder=" Full name"
            onChange={handleChange("name")}
            value={uservalue.name}
          />
          <label for="password"></label>
          <input
            type="password"
            name="password"
            className="txt2"
            placeholder=" Password"
            onChange={handleChange("password")}
            value={uservalue.password}
          />
          <label for="confirmpass"> </label>
          <input
            type="password"
            name="confirmpass"
            className="txt3"
            placeholder=" Confirm Password"
            onChange={handleChange("confirmpass")}
            value={uservalue.confirmpass}
          />{" "}
          <br></br>
          <button onClick={register} className=" regbtn">
            Register
          </button>
        </form>
      </div>
      <div className="column2">
        <p className="p2">Sign up to see photos and videos from your friends</p>{" "}
        <br></br>
        <p className="p3">Have an account?</p>
        <Link to="/login" className="Login">
          Login
        </Link>
      </div>
    </div>
  );
}
