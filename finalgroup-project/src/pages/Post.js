import React, { useState, useEffect, useRef } from "react";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SendOutlinedIcon from "@material-ui/icons/SendOutlined";
import { PermMedia} from "@material-ui/icons";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import "../css/App.css";
import "../css/home.css";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router";
import firebase from "../utils/firebase";

//Modal
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function Post(props) {
  const db = firebase.firestore();
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [commentVisible, setCommentVisible] = useState("0");
  const [postComments, setPostComments] = useState([]);
  const [postData, setPostData] = useState([]);
  useEffect(() => {
    let foundContents = [];
    const fetchData = () => {
      db.collection("users").onSnapshot((doc) => {
        doc.forEach((user) => {
          db.collection("users")
            .doc(user.id)
            .collection("post")
            .onSnapshot((doc) => {
              doc.forEach((c) => {
                foundContents.push({ ...c.data(), id: c.id });
                // console.log(c.id)
              });
              let check = {};
              let res = [];
              for (let i = 0; i < foundContents.length; i++) {
                if (!check[foundContents[i]["description"]]) {
                  check[foundContents[i]["description"]] = true;
                  res.push(foundContents[i]);
                }
              }
              setPostData(res);
              // console.log(res);
            });
        });
      });
    };
    fetchData();
  }, []);

  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();
  const storage = firebase.storage();
  const [upload, setUpload] = useState(false);
  const [values, setValues] = useState({
    description: "",
    imgPost: "",
  });
  const [message, setMessage] = useState({
    message: "",
  });
  const history = useHistory();
  const currentUser = firebase.auth().currentUser;
  const [docId, setDocId] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [profileName, setProfileName] = useState("");
  useEffect(() => {
    const fetchData = () => {
      db.collection("users")
        .doc(currentUser.uid)
        .collection("profile")
        .onSnapshot((doc) => {
          doc.forEach((c) => {
            setProfileImg(c.data().img);
            setProfileName(c.data().name);
          });
        });
    };
    fetchData();
  }, []);

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

  let subtitle;
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
    setPreview("");
  }

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

  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const likehandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };
  const handleMessage = (prop) => (e) => {
    setMessage({ ...message, [prop]: e.target.value });
  };

  const post = (e) => {
    let myid = uuid();
    e.preventDefault();
    if (upload) {
      const uploadPhoto = storage.ref(`images-posts/${myid}`).put(image);
      uploadPhoto.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images-posts")
            .child(myid)
            .getDownloadURL()
            .then((url) => {
              db.collection("users")
                .doc(currentUser.uid)
                .collection("post")
                .add({
                  postId: docId,
                  currentId: currentUser.uid,
                  imgProf: profileImg,
                  nameProf: profileName,
                  imgPost: url,
                  description: values.description,
                });
            });
          alert("Your post is created!");
          history.push("./home");
        }
      );
    } else {
      db.collection("users").doc(currentUser.uid).collection("post").add({
        postId: docId,
        currentId: currentUser.uid,
        imgProf: profileImg,
        nameProf: profileName,
        imgPost: "",
        description: values.description,
      });
      alert("Your post is created!");
      history.push("./home");
    }
  };
  const [countLike, setCountLike] = useState(0);
  const [idid, setIdid] = useState("");
  useEffect(() => {
    let count = 0;
    db.collection("users").onSnapshot((doc) => {
      doc.forEach((user) => {
        db.collection("users")
          .doc(user.id)
          .collection("post")
          .doc(props.item.id)
          .collection("likes")
          .onSnapshot((doc) => {
            doc.forEach((c) => {
              if (currentUser.uid === c.data().like_id) {
                setIsLiked(true);
              }
              count++;
            });
            setCountLike(count);
          });
      });
    });
  }, [isLiked]);

  const setlike = (idid, user_id) => {
    db.collection("users")
      .doc(user_id)
      .collection("post")
      .doc(idid)
      .collection("likes")
      .add({
        like_id: currentUser.uid,
        like_photo: profileImg,
        like_username: profileName,
      })
      .then((docRef) => {
        //success
        setIsLiked(true);
        // setLikeDetails([]);
      })
      .catch((err) => {
        //error
      });
  };
  const unlike = (idid, user_id) => {
    db.collection("users").onSnapshot((doc) => {
      doc.forEach((user) => {
        db.collection("users")
          .doc(user.id)
          .collection("post")
          .doc(idid)
          .collection("likes")
          .get()
          .then((doc) => {
            doc.forEach((c) => {
              db.collection("users")
                .doc(user.id)
                .collection("post")
                .doc(idid)
                .collection("likes")
                .doc(c.id)
                .delete()
                .then(() => {
                  //success
                  setIsLiked(false);
                })
                .catch((error) => {
                  //error
                });
              // return;
            });
          });
      });
    });
  };

  const postComment = (currentId, postId) => {
    // alert(currentId)
    // alert(postId)
    db.collection("users")
      .doc(currentId)
      .collection("post")
      .doc(postId)
      .collection("comments")
      .add({
        commentMessage: message.message,
        commentorId: currentId,
        commentorName: profileName,
        commentPhoto: profileImg,
      });
    setMessage({ message: "" });
  };

  const showComments = (postId) => {
    db.collection("users").onSnapshot((doc) => {
      doc.forEach((user) => {
        db.collection("users")
          .doc(user.id)
          .collection("post")
          .doc(postId)
          .collection("comments")
          .onSnapshot((doc) => {
            let foundComments = postComments || [];
            doc.forEach((c) => {
              foundComments.push({ ...c.data(), id: c.id });
              console.log(c.data());
            });
            let check = {};
            let resComments = [];
            for (let i = 0; i < foundComments.length; i++) {
              if (!check[foundComments[i]["commentMessage"]]) {
                check[foundComments[i]["commentMessage"]] = true;
                resComments.push(foundComments[i]);
              }
            }
            setPostComments(resComments);
            console.log(resComments);
            setCommentVisible("1");
          });
      });
    });
  };

  return (
    <div>
      <div className="container">
        <div className="home">
          <div className="homeContainer">
            <div className="homeContent">
              <img src={props.item.imgProf} className="homeImg" />
              <h4>{props.item.nameProf}</h4>
            </div>
            <p>{props.item.description}</p>
            <div className="homeCenter">
              <img src={props.item.imgPost} className="homeCenterImg" />
            </div>
            <div className="homeBottom">
              <div className="likeButton" onClick={likehandler}>
                {!isLiked ? (
                  <FavoriteBorderIcon
                    fontSize={"large"}
                    onClick={(e) => {
                      e.preventDefault();
                      setlike(props.item.id, props.item.currentId);
                    }}
                  />
                ) : (
                  <FavoriteIcon
                    fontSize={"large"}
                    onClick={(e) => {
                      e.preventDefault();
                      unlike(props.item.id, props.item.currentId);
                    }}
                  />
                )}
                {countLike}
              </div>
              <div className="commentButton">
                <ChatBubbleOutlineOutlinedIcon
                  fontSize={"large"}
                  className="likeIcon"
                  onClick={() => {
                    if (commentVisible === "1") {
                      setCommentVisible("0");
                      setPostComments([]);
                    } else {
                      showComments(props.item.id);
                    }
                  }}
                />
              </div>
              <div className="shareButton">
                <SendOutlinedIcon fontSize={"large"} className="likeIcon" />
              </div>
            </div>
            <div className="commentSection">
              <div className="writeComment">
                <img src={props.item.imgProf} className="homeImg" />
                <input
                  type="text"
                  id="myInput"
                  className="commentInput  commentImg"
                  placeholder="Write Something"
                  values={message.message}
                  onChange={handleMessage("message")}
                />
                <button
                  className="commentBtn"
                  onClick={() => {
                    postComment(props.item.currentId, props.item.id);
                    document.getElementById("myInput").value = "";
                  }}
                >
                  Comment
                </button>
              </div>

              {commentVisible === "1" ? (
                postComments.map((item, key) => {
                  return (
                    <div className="postCommentSection">
                      <img
                        className="commentProf"
                        src={item.commentPhoto}
                        alt=""
                      />
                      &nbsp;&nbsp;
                      <h5>{item.commentorName} : </h5>
                      <p>&nbsp;{item.commentMessage}</p>
                    </div>
                  );
                })
              ) : (
                <div
                  className="postCommentSection"
                  style={{ display: "none" }}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="postWrapper">
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Create Post</h2>

          <textarea
            type="textarea"
            className="postInput"
            placeholder="What's in your mind?"
            onChange={handleChange("description")}
          ></textarea>

          <div className="postUpload">
            <div className="uploadBtn">
              <PermMedia htmlColor="black" className="shareIcon" />
              <span
                className="shareOptionText"
                onClick={(event) => {
                  fileInputRef.current.click();
                }}
              >
                Upload photo
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={previewFile}
                />
              </span>
            </div>
          </div>
          <center>
            {!preview ? (
              <img
                src={preview}
                className="imagePreview"
                style={{ display: "none" }}
              ></img>
            ) : (
              <img src={preview} className="imagePreview"></img>
            )}
          </center>
        </div>

        <div className="postButtons">
          <button className="button button1" onClick={(e) => post(e)}>
            Post
          </button>
          <button
            className="button button3"
            onClick={() => {
              document.getElementsByClassName("postInput").value = "";
              closeModal();
            }}
          >
            Cancel
          </button>
        </div>
      </Modal>
      <div>
        <Fab
          variant="extended"
          style={{ top: 640, marginLeft: "92%", position: "fixed" }}
          onClick={openModal}
        >
          <AddIcon />
          Post
        </Fab>
      </div>
    </div>
  );
}

export default Post;
