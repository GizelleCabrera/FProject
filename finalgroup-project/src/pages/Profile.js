import React, { useState, useEffect, useRef } from "react";
import Topbar from "../components/topbar/Topbar";
import Sidebar from "../components/sidebar/Sidebar";
import firebase from "../utils/firebase";
import AppsIcon from "@material-ui/icons/Apps";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import "../css/profile.css";

import "../css/App.css";
function Profile() {
  const storage = firebase.storage();
  const db = firebase.firestore();
  const currentUser = firebase.auth().currentUser;
  const [profileImage, getProfileImage] = useState("");
  const [profileName, getProfileName] = useState("");
  const [docId, setDocId] = useState("");
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

  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();
  const [upload, setUpload] = useState(false);
  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  const previewFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setUpload(true);
    } else {
      setImage(null);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cancel = () => {
    setOpen(false);
  };
  useEffect(() => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("profile")
      .onSnapshot((doc) => {
        doc.forEach((c) => {
          setDocId(c.id);
        });
      });
  }, []);
  const save = () => {
    setOpen(true);
    if (upload) {
      const uploadPhoto = storage
        .ref(`images-profile/${image.name}`)
        .put(image);
      uploadPhoto.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images-profile")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              const currentUser = firebase.auth().currentUser;
              db.collection("users")
                .doc(currentUser.uid)
                .collection("profile")
                .doc(docId)
                .set({
                  img: url,
                  email: currentUser.email,
                  name: profileName,
                });
              alert("Profile picture changed succesfully");

              setOpen(false);
            });
        }
      );
    } else {
      setOpen(false);
    }
  };
  return (
    <div>
      <Topbar />
      <div className="container">
        <div className="side">
          <Sidebar />
        </div>

        <div className="profile">
          <div className="profileContainer">
            <div className="profileContent">
              <div className="profileColumn1">
                {!profileImage && !open ? (
                  <PermIdentityIcon style={{ fontSize: 150, marginLeft: 25 }} />
                ) : open ? (
                  <img src={preview} className="profImg" />
                ) : (
                  <img src={profileImage} className="profImg" />
                )}

                <h4>{profileName}</h4>
                <button
                  onClick={(event) => {
                    fileInputRef.current.click();
                    handleOpen();
                  }}
                  className="upload-btn"
                >
                  Upload
                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={previewFile}
                  />
                </button>
                {!open ? (
                  <button className="save-btn" style={{ display: "none" }}>
                    Save
                  </button>
                ) : (
                  <button className="save-btn" onClick={save}>
                    Save
                  </button>
                )}

                {!open ? (
                  <button className="cancel-btn" style={{ display: "none" }}>
                    Cancel
                  </button>
                ) : (
                  <button className="cancel-btn" onClick={cancel}>
                    Cancel
                  </button>
                )}
              </div>
              <div className="profileColumn2">
                <div>
                  <p className="num1">20</p>
                  <p className="post1">Post</p>
                </div>
                <div>
                  <p className="num1">500</p>
                  <p className="post1">Followers</p>
                </div>
                <div>
                  <p className="num1">100</p>
                  <p className="post1">Following</p>
                </div>
              </div>
            </div>
            <div className="Content">
              <div className="postSection">
                <AppsIcon />
              </div>
              <div className="TagSection">
                <LoyaltyIcon />
              </div>
              <div className="LocSection">
                <LocationOnIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
