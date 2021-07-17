import React, { useState, useEffect } from "react";
import firebase from "../../utils/firebase";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import "./topbar.css";
import { Search } from "@material-ui/icons";
import img2 from "../images/img3.png";
// import { PersonPin } from "@material-ui/icons";

export default function Topbar() {
  const db = firebase.firestore();
  const currentUser = firebase.auth().currentUser;
  const [profileImage, getProfileImage] = useState("");
  const [profileName, getProfileName] = useState("");
  useEffect(() => {
    const fetchData = () => {
      db.collection("users")
        .doc(currentUser.uid)
        .collection("profile")
        .onSnapshot((doc) => {
          doc.forEach((c) => {
            getProfileImage(c.data().img);
            getProfileName(c.data().name);
          });
        });
    };
    fetchData();
  }, []);

  return (
    <div className=" Topbar_Container">
      <div className="topbarLeft">
        <img src={img2} alt="" className="img4" />
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search classname=" searchIcon" />
          <input placeholder="Search" className="searchInput" />
        </div>
      </div>
      <div className="topbarRight">
        <div className="sideProfile">
          {!profileImage ? (
            <PermIdentityIcon style={{ fontSize: 80, marginLeft: 60 }} />
          ) : (
            <img src={profileImage} className="sideBarImage" />
          )}
          <p style={{ marginLeft: 20, fontWeight: "bolder", fontSize: "13px" }}>
            {profileName}
          </p>
        </div>
      </div>
    </div>
  );
}
