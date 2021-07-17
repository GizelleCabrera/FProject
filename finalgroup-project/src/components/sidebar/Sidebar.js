import React from "react";
import firebase from "../../utils/firebase";
import { SidebarData } from "../sidebar/SidebarData";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
export default function Sidebar() {
  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        alert("Successfully Logged out");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <div className="container">
      <div className="Sidebar">
        <ul className="SidebarList">
          {SidebarData.map((val, key) => {
            return (
              <li
                key={key}
                className="row"
                id={window.location.pathname === val.link ? "active" : ""}
                onClick={() => {
                  window.location.pathname = val.link;
                }}
              >
                {" "}
                <div id="icon">{val.icon} </div>{" "}
                <div id="title">{val.title}</div>
              </li>
            );
          })}

          <li className="row" onClick={logout}>
            <div id="icon">
              <ExitToAppIcon />{" "}
            </div>{" "}
            <div id="title">Log out</div>
          </li>
        </ul>
      </div>
    </div>
  );
}
