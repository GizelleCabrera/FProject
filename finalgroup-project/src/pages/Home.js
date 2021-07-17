import React, { useState, useEffect } from "react";
import Topbar from "../components/topbar/Topbar";
import Sidebar from "../components/sidebar/Sidebar";
import "../css/App.css";
import "../css/home.css";
import Post from "../pages/Post";
import firebase from "../utils/firebase";
function Home() {
  const db = firebase.firestore();
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
                console.log(c.data());
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

  return (
    <div>
      <Topbar />
      <div className="side">
        <Sidebar />
      </div>
      {postData.map((item, key) => (
        <Post key={key} item={item} />
      ))}
      <div>
       
      </div>
    </div>
  );
}

export default Home;
