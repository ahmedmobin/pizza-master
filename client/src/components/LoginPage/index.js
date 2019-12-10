import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Form, Error } from "../Layout";
import { useAuth } from "../../context/auth";

function LoginPage(props) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();
  const referer = props.location.state.referer || "/";

  function postLogin(e) {
    e.preventDefault();
    if ((userName === "admin", password === "admin")) {
      setAuthTokens({
        admin: "THis is the admin"
      });
      setLoggedIn(true);
    } else if ((userName === "user", password === "user")) {
      setAuthTokens({
        user: "THis is the user"
      });
      setLoggedIn(true);
    } else {
      setIsError(true);
    }
  }

  if (isLoggedIn) {
    return <Redirect to={referer} />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-6 mx-auto">
          <Form onSubmit={postLogin}>
            <div className="form-group">
              <label className="col-form-label" htmlFor="username">
                username
              </label>
              <input
                type="text"
                value={userName}
                className="form-control"
                placeholder="username"
                id="username"
                onChange={e => {
                  setUserName(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label className="col-form-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                value={password}
                className="form-control"
                placeholder="password"
                id="password"
                onChange={e => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            <button
              className="btn btn-outline-secondary"
              type="submit"
              onClick={postLogin}
            >
              Sign In
            </button>
          </Form>
          {isError && (
            <Error>The username or password provided were incorrect!</Error>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
