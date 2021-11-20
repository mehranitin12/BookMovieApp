import React, { useState } from "react";
import "./Header.css";
import Logo from "../../assets/logo.svg";
import {
  Button,
  FormControl,
  IconButton,
  Tabs,
  Tab,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import ReactModal from "react-modal";
import Close from "@material-ui/icons/Close";
import { Link } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <div p={3}>{children}</div>}</div>;
}

const Header = function (props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [value, setValue] = useState(0);
  const [userName, setUserName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [buttonLogin, setButtonLogin] = useState("LOGIN");
  const [signUp, setSignUp] = useState("");
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  const [loginDetail, setLoginDetail] = useState("");
  const accessedDetailsPage = props.buttonRequest;
  const detailsID = props.getDetails;
  const [reqLoginUserName, setReqLoginUserName] = useState("dispNone");
  const [reqLoginPassword, setReqLoginPassword] = useState("dispNone");
  const [reqPhone, setReqPhone] = useState("dispNone");
  const [reqEmail, setReqEmail] = useState("dispNone");
  const [reqPassword, setReqPassword] = useState("dispNone");
  const [reqFirstName, setReqFirstName] = useState("dispNone");
  const [reqLastName, setReqLastName] = useState("dispNone");

  React.useEffect(() => {
    const loginInfo = window.sessionStorage.getItem("access-token");
    if (loginInfo) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
  }, []);
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Login functionality - implementation
  async function login() {
    const param = window.btoa(`${userName}:${loginPassword}`);
    if (userName === "" || loginPassword === "") {
      userName === ""
        ? setReqLoginUserName("dispBlock")
        : setReqLoginUserName("dispNone");
      loginPassword === ""
        ? setReqLoginPassword("dispBlock")
        : setReqLoginPassword("dispNone");
      setLoginDetail("Enter all the values");
    } else {
      try {
        const rawResponse = await fetch(
          "http://localhost:8085/api/v1/auth/login",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
              authorization: `Basic ${param}`,
            },
          }
        );

        const result = await rawResponse.json();
        if (rawResponse.ok) {
          window.sessionStorage.setItem("user-details", JSON.stringify(result));
          window.sessionStorage.setItem(
            "access-token",
            rawResponse.headers.get("access-token")
          );
          setButtonLogin("LOGOUT");
          setIsOpen(false);
          setLoginDetail("");
          setUserLoggedIn(true);
          setUserName("");
          setLoginPassword("");
        } else {
          const error = new Error();
          error.message = result.message || "Something went wrong.";
          setLoginDetail("Incorrect username or password");
        }
      } catch (e) {
        alert(`Error: ${e.message}`);
        setLoginDetail("Incorrect username or password");
      }
    }
  }

  // Logout functionality - implementation
  async function logout() {
    const param = window.sessionStorage.getItem("access-token");
    const rawResponse = await fetch(
      "http://localhost:8085/api/v1/auth/logout",
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          authorization: `Bearer ${param}`,
        },
      }
    );

    if (rawResponse.ok) {
      setButtonLogin("LOGIN");
      window.sessionStorage.clear();
      setUserLoggedIn(false);
    } else {
      setLoginDetail("Incorrect username or password");
    }
  }

  // Register functionality - implementation
  const handleSubmitSignup = async () => {
    const params = {
      email_address: email,
      first_name: firstName,
      last_name: lastName,
      mobile_number: phone,
      password: password,
    };
    if (
      email === "" ||
      firstName === "" ||
      lastName === "" ||
      phone === "" ||
      password === ""
    ) {
      email === "" ? setReqEmail("dispBlock") : setReqEmail("dispNone");
      firstName === ""
        ? setReqFirstName("dispBlock")
        : setReqFirstName("dispNone");
      lastName === ""
        ? setReqLastName("dispBlock")
        : setReqLastName("dispNone");
      phone === "" ? setReqPhone("dispBlock") : setReqPhone("dispNone");
      password === ""
        ? setReqPassword("dispBlock")
        : setReqPassword("dispNone");
      setSignUp("Please enter all the details!");
    } else {
      fetch("http://localhost:8085/api/v1/signup", {
        body: JSON.stringify(params),
        Method: "POST",
        headers: {
          Accept: "application/json;charset=UTF-8",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => {
          response.json();
          setSignUp("Registration Successful. Please Login!");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setPhone("");
          console.log("fetch done");
        })
        .catch((error) => {
          setSignUp("Registration not successful.");
        });
    }
  };

  // Login - Logout button
  const loginOrLogout = () => {
    if (!isUserLoggedIn) {
      setIsOpen(true);
      setButtonLogin("LOGIN");
    }
  };

  // Bookshow button
  const handleBookShow = () => {
    if (buttonLogin === "LOGIN") {
      setIsOpen(true);
    }
  };

  return (
    <div>
      <div className="header">
        <img className="img-fluid" src={Logo} alt="logo" />

        {isUserLoggedIn ? (
          <Button variant="contained" className="buttonLogin" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button
            variant="contained"
            className="buttonLogin"
            onClick={loginOrLogout}
          >
            Login
          </Button>
        )}

        {accessedDetailsPage && isUserLoggedIn && (
          <Link to={`/bookshow/${detailsID}`}>
            <Button
              variant="contained"
              className="bookMyShow"
              color="primary"
              onClick={handleBookShow}
            >
              {props.buttonNeeded}
            </Button>
          </Link>
        )}
        {accessedDetailsPage && !isUserLoggedIn && (
          <Button
            onClick={loginOrLogout}
            variant="contained"
            color="primary"
            className="bookMyShow"
          >
            {props.buttonNeeded}
          </Button>
        )}
        <div className="modalStyling">
          <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Login Modal"
            ariaHideApp={false}
            className="custom-model-class"
          >
            <IconButton onClick={closeModal} className="closeButton">
              <Close></Close>
            </IconButton>
            <br />
            <br />
            <div className="tabAllignments">
              <Tabs value={value} onChange={handleChange}>
                <Tab className="tabAllignments" label="Login" />
                <Tab className="tabAllignments" label="Register" />
              </Tabs>

              {/* Login form - implementation */}
              <TabPanel value={value} index={0}>
                <FormControl className="forms">
                  <br />
                  <TextField
                    label="Username"
                    variant="standard"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required={true}
                  />
                  <FormHelperText className={reqLoginUserName}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />

                  <TextField
                    label="Password"
                    variant="standard"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required={true}
                  />
                  <FormHelperText className={reqLoginPassword}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />
                  <div className="error-details-login">{loginDetail}</div>
                  <Button variant="contained" color="primary" onClick={login}>
                    LOGIN
                  </Button>
                  <br />
                </FormControl>
              </TabPanel>

              {/* Register form - implementation */}
              <TabPanel value={value} index={1}>
                <FormControl className="forms">
                  <br />
                  <TextField
                    label="First Name"
                    variant="standard"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={true}
                  />
                  <FormHelperText className={reqFirstName}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />
                  <TextField
                    label="Last Name"
                    variant="standard"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={true}
                  />
                  <FormHelperText className={reqLastName}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />
                  <TextField
                    label="Email"
                    variant="standard"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={true}
                  />
                  <FormHelperText className={reqEmail}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />
                  <TextField
                    label="Password"
                    variant="standard"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={true}
                  />
                  <FormHelperText className={reqPassword}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />
                  <TextField
                    label="Contact No."
                    variant="standard"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required={true}
                  />
                  <FormHelperText className={reqPhone}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />
                  <div className="error-details-login">{signUp}</div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitSignup}
                  >
                    REGISTER
                  </Button>
                  <br />
                </FormControl>
              </TabPanel>
            </div>
          </ReactModal>
        </div>
      </div>
    </div>
  );
};

export default Header;
