import "./css/App.css"; 
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from "./routers/PrivateRoute";
import PublicRoute from "./routers/PublicRoute";
import React, {useState, useEffect} from "react";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Notfound from "./pages/404"
import firebase from "./utils/firebase";

export default function App() {
  const [values, setValues] = useState({
    isAuth: false,
    isLoading: true,
  })

  useEffect(() => {
   firebase.auth().onAuthStateChanged((user) => {
     if (user) {
       // User is signed in, see docs for a list of available properties
       // https://firebase.google.com/docs/reference/js/firebase.User
       setValues({isAuth: true, isLoading:false});
       //var uid = user.uid;
       // ...
     } else {
       // User is signed out
       // ...
        setValues({ isAuth: false, isLoading: false });
     }
   });
  }, []);

  if(values.isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/login" />
          </Route>

          <PrivateRoute
            component={Home}
            isAuth={values.isAuth}
            path="/home"
            exact
          />

          <PrivateRoute
            component={Profile}
            isAuth={values.isAuth}
            path="/profile"
          />

          <PrivateRoute component={Post} isAuth={values.isAuth} path="/post" />

          <PublicRoute
            component={Login}
            isAuth={values.isAuth}
            restricted={true}
            path="/login"
          />

          <PublicRoute
            component={Registration}
            isAuth={values.isAuth}
            restricted={false}
            path="/register"
          />

          <Route component={Notfound} />
        </Switch>
      </Router>
    </div>
  );
}
