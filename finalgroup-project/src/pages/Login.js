import React, { useState } from 'react'
import { Link } from "react-router-dom";
import firebase from "../utils/firebase";
import "../css/login.css"
import img from "../components/images/img1.png"
import img2 from "../components/images/img3.png";



export default function Login() {
    const [uservalue,setUservalue] = useState({
        email: "",
        password: "",
    })
    //const history = useHistory();
    const handleChange = (prop) => (e) =>{
        setUservalue({...uservalue, [prop]: e.target.value})
    }
    const login = (e) =>{
        e.preventDefault();
        if (!uservalue.email || !uservalue.password){
          alert("Fields not complete")
        }else{
          firebase
            .auth()
            .signInWithEmailAndPassword(uservalue.email, uservalue.password)
            .then((userCredential) => {
              // Signed in
              //var user = userCredential.user;
              // ...
              alert("Signed in");
            })
            .catch((error) => {
              //var errorCode = error.code;
              var errorMessage = error.message;
              alert(errorMessage);
            });
        }
    }
    return (
      <div className=" container2">
        <div className="column1">
          <img src={img} alt="" className="img1" /> <br></br>
          <label htmlFor="email"></label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="txt1"
            onChange={handleChange("email")}
            value={uservalue.email}
          />
          <label htmlFor="password"></label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="txt2"
            onChange={handleChange("password")}
            value={uservalue.password}
          />{" "}
          <br></br>
          <button className="btn" onClick={login}>
            Login
          </button>
        </div>
        <div className="column2">
          <img src={img2} alt="" className="img3" /> 
          <p className="p1">Don't have an account? </p>
          <Link to="/register" className="reg">
            Sign up
          </Link>
        </div>
      </div>
    );
}
