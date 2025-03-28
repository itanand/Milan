import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/UserLogin.css";
import { LoginUser } from "../../service/MilanApi";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

import SchemaValidator, { msgLocalise } from "../../utils/validation";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";
import { ReactComponent as Authbanner } from "../../assets/pictures/authpages/authbannerimg.svg";
import { showErrorToast, showSuccessToast } from "../../utils/showToast";

function UserLogin() {
  const Navigate = useNavigate();

  function Anchor(props) {
    return (
      <div>
        <p>
          {props.para}
          <Link to={props.link}>{props.details}</Link>
        </p>
      </div>
    );
  }

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const FormDataProto = {
    id: "/LoginForm",
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 4 },
    },
    required: ["email", "password"],
  };

  //* To set the value as soon as we input
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  //* Submit to backend
  //* If alright we get a cookie with token
  const handleSubmit = (e) => {
    toast.clearWaitingQueue();
    e.preventDefault();
    var validator = SchemaValidator(FormDataProto, { ...credentials });

    if (validator.valid) {
      const Data = LoginUser(credentials);

      Data.then((response) => {
        if (response?.data.token) {
          Cookies.set("token", response.data.token);
          showSuccessToast("Logged you in !");
          Navigate("/");
        } else {
          setCredentials({ email: "", password: "" });
        }
      }).catch((err) => {
        showErrorToast("Server error, try again later !");
      });
    } else {
      validator.errors.map(function (e, i) {
        return toast(`${e.path[0]} : ${msgLocalise(e)}`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          closeButton: false,
        });
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Milan | User login</title>
        <meta
          name="description"
          content="Welcome to the User's login page. Login to Milan with your email and password."
        />
        <link rel="canonical" href="/" />
      </Helmet>


      <section className="vh-100">
        <div className="container py-5 h-100">
          <div className="d-flex align-items-top justify-content-center h-100 gap-1 ">
            <div className="col-md-8 col-lg-7 col-xl-6">
              <Authbanner className="authimg" />
            </div>

            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
              <form
                style={{ width: "auto" }}
                onSubmit={handleSubmit}
                className="loginform"
              >
                <h1 className="mb-2">Login as an User !</h1>
                <div className="form-outline mb-4">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="col-form-label col-form-label-lg regformlabels"
                  >
                    Email address 📨
                  </label>
                  <input
                    type="email"
                    className="desktop form-control form-control-lg"
                    id="desktopUserEmail"
                    aria-describedby="emailHelp"
                    placeholder="Enter your email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-label="email"
                    autoFocus
                  />
                </div>

                <label
                  htmlFor="exampleInputPassword1"
                  className="col-form-label col-form-label-lg regformlabels color"
                >
                  Password 🔑
                </label>
                <div className="form-outline mb-4">
                  <input
                    type="password"
                    className="desktop form-control form-control-lg"
                    id="desktopUserPassword"
                    placeholder="Enter your password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    aria-label="password"
                  />
                </div>

                {/* RememberMe Tab  */}

                {/* Login Button */}
                <div className="btn-container btn-container-desktop">
                  <button
                    type="submit"
                    className="login-btn btn btn-lg btn-block"
                  >
                    Login
                  </button>
                </div>
                <br></br>
                <br></br>
                <div className="anchor-container anchor-container-desktop">
                  <Anchor
                    para=""
                    details="Forgot password?"
                    link="/user/forgotpass"
                    className="text-muted"
                  />
                  <Anchor
                    para="Don't have an account? "
                    details="Register here"
                    link="/user/register"
                    className="link-info"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default UserLogin;
