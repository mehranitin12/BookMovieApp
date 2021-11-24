import React, { Fragment, useState } from "react";
import "./Header.css";
import logo from "../../assets/logo.svg";
import {
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";
import Modal from "react-modal";
import { Link } from "react-router-dom";

const Header = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("access-token") == null ? false : true
  );
  const [openLoginRegisterModal, setOpenLoginRegisterModal] = useState(false);
  const [modalTabValue, setModalTabValue] = useState(0);
  const handleCloseLoginRegisterModal = () => setOpenLoginRegisterModal(false);
  const [loginFormValues, setLoginFormValues] = useState({
    username: "",
    password: "",
  });
  const [usernameRequired, setUsernameRequired] = useState(false);
  const [loginPasswordRequired, setLoginPasswordRequired] = useState(false);

  const [registerFormValues, setRegisterFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    registerPassword: "",
    contact: "",
  });

  const [firstNameRequired, setFirstNameRequired] = useState(false);
  const [lastNameRequired, setLastNameRequired] = useState(false);
  const [emailRequired, setEmailRequired] = useState(false);
  const [contactRequired, setContactRequired] = useState(false);
  const [registerPasswordRequired, setRegisterPasswordRequired] =
    useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

  const modalProperties = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const handleModalTabChange = (event, newValue) => {
    setModalTabValue(newValue);
  };

  const onLoginFormSubmit = (e) => {
    e.preventDefault();
    setUsernameRequired(loginFormValues.username === "" ? true : false);
    setLoginPasswordRequired(loginFormValues.password === "" ? true : false);

    fetch(props.baseUrl + "auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization:
          "Basic " +
          window.btoa(
            loginFormValues.username + ":" + loginFormValues.password
          ),
      },
    })
      .then((response) => {
        sessionStorage.setItem(
          "access-token",
          response.headers.get("access-token")
        );
        return response.json();
      })
      .then((response) => {
        if (response.status === "ACTIVE") {
          setIsLoggedIn(true);
          handleCloseLoginRegisterModal();
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const logoutHandler = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("access-token");
    setIsLoggedIn(false);
  };

  const onRegisterFormSubmit = (e) => {
    e.preventDefault();

    setFirstNameRequired(registerFormValues.firstname === "" ? true : false);
    setLastNameRequired(registerFormValues.lastname === "" ? true : false);
    setEmailRequired(registerFormValues.email === "" ? true : false);
    setRegisterPasswordRequired(
      registerFormValues.registerPassword === "" ? true : false
    );
    setContactRequired(registerFormValues.contact === "" ? true : false);

    let signUpData = JSON.stringify({
      first_name: registerFormValues.firstname,
      last_name: registerFormValues.lastname,
      email_address: registerFormValues.email,
      mobile_number: registerFormValues.contact,
      password: registerFormValues.registerPassword,
    });

    fetch(props.baseUrl + "signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: signUpData,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setIsRegistrationSuccess(response.status === "ACTIVE" ? true : false);
      });
  };

  return (
    <Fragment>
      <header className="navbar">
        <img src={logo} className="logo logo-animation" alt="logo" />
        {isLoggedIn ? (
          <Button
            onClick={(e) => logoutHandler(e)}
            className="login-logout-button"
            color="default"
            variant="contained"
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={(e) => setOpenLoginRegisterModal(true)}
            className="login-logout-button"
            color="default"
            variant="contained"
          >
            Login
          </Button>
        )}

        {props.showBookShowButton === "true" && !isLoggedIn ? (
          <div className="bookshow-button">
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => setOpenLoginRegisterModal(true)}
            >
              Book Show
            </Button>
          </div>
        ) : (
          ""
        )}

        {props.showBookShowButton === "true" && isLoggedIn ? (
          <div className="bookshow-button">
            <Link to={"/bookshow/" + props.id}>
              <Button variant="contained" color="primary">
                Book Show
              </Button>
            </Link>
          </div>
        ) : (
          ""
        )}
      </header>
      <Modal
        ariaHideApp={false}
        isOpen={openLoginRegisterModal}
        contentLabel="Login"
        onRequestClose={handleCloseLoginRegisterModal}
        style={modalProperties}
      >
        <Tabs
          className="tabs"
          value={modalTabValue}
          onChange={handleModalTabChange}
          variant="fullWidth"
        >
          <Tab label="LOGIN" />
          <Tab label="REGISTER" />
        </Tabs>
        {modalTabValue === 0 && (
          <div style={{ padding: 0, textAlign: "center" }}>
            <FormControl required>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input
                id="username"
                type="text"
                value={loginFormValues.username}
                onChange={(e) => {
                  setLoginFormValues({
                    ...loginFormValues,
                    username: e.target.value,
                  });
                }}
              />
              {usernameRequired && (
                <FormHelperText>
                  <span className="red">required</span>
                </FormHelperText>
              )}
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="loginPassword">Password</InputLabel>
              <Input
                id="loginPassword"
                type="password"
                value={loginFormValues.password}
                onChange={(e) => {
                  setLoginFormValues({
                    ...loginFormValues,
                    password: e.target.value,
                  });
                }}
              />
              {loginPasswordRequired && (
                <FormHelperText>
                  <span className="red">required</span>
                </FormHelperText>
              )}
            </FormControl>
            <br />
            <br />
            {isLoggedIn === true && (
              <FormControl>
                <span className="successText">Login Successful!</span>
              </FormControl>
            )}
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={onLoginFormSubmit}
            >
              LOGIN
            </Button>
          </div>
        )}

        {modalTabValue === 1 && (
          <div style={{ padding: 0, textAlign: "center" }}>
            <FormControl required>
              <InputLabel htmlFor="firstname">First Name</InputLabel>
              <Input
                id="firstname"
                type="text"
                value={registerFormValues.firstname}
                onChange={(e) => {
                  setRegisterFormValues({
                    ...registerFormValues,
                    firstname: e.target.value,
                  });
                }}
              />
              {firstNameRequired && (
                <FormHelperText>
                  <span className="red">required</span>
                </FormHelperText>
              )}
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="lastname">Last Name</InputLabel>
              <Input
                id="lastname"
                type="text"
                value={registerFormValues.lastname}
                onChange={(e) => {
                  setRegisterFormValues({
                    ...registerFormValues,
                    lastname: e.target.value,
                  });
                }}
              />
              {lastNameRequired && (
                <FormHelperText>
                  <span className="red">required</span>
                </FormHelperText>
              )}
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                type="text"
                value={registerFormValues.email}
                onChange={(e) => {
                  setRegisterFormValues({
                    ...registerFormValues,
                    email: e.target.value,
                  });
                }}
              />
              {emailRequired && (
                <FormHelperText>
                  <span className="red">required</span>
                </FormHelperText>
              )}
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="registerPassword">Password</InputLabel>
              <Input
                id="registerPassword"
                type="password"
                value={registerFormValues.registerPassword}
                onChange={(e) => {
                  setRegisterFormValues({
                    ...registerFormValues,
                    registerPassword: e.target.value,
                  });
                }}
              />
              {registerPasswordRequired && (
                <FormHelperText>
                  <span className="red">required</span>
                </FormHelperText>
              )}
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="contact">Contact No.</InputLabel>
              <Input
                id="contact"
                type="text"
                value={registerFormValues.contact}
                onChange={(e) => {
                  setRegisterFormValues({
                    ...registerFormValues,
                    contact: e.target.value,
                  });
                }}
              />
              {contactRequired && (
                <FormHelperText>
                  <span className="red">required</span>
                </FormHelperText>
              )}
            </FormControl>
            <br />
            <br />
            {isRegistrationSuccess === true && (
              <FormControl>
                <span>Registration Successful. Please Login!</span>
              </FormControl>
            )}
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={onRegisterFormSubmit}
            >
              REGISTER
            </Button>
          </div>
        )}
      </Modal>
    </Fragment>
  );
};

export default Header;
