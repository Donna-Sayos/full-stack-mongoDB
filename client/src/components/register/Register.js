import React, { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import { BiShow, BiHide } from "react-icons/bi";
import "./index.css";

export default function Register() {
  const username = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const gender = useRef();
  const otherGender = useRef();
  const pronouns = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const [showOtherGender, setShowOtherGender] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const clickHandler = async (e) => {
    e.preventDefault();
    if (confirmPassword.current.value !== password.current.value) {
      confirmPassword.current.setCustomValidity(
        "The passwords entered don't match. Please try again."
      );
    } else {
      let userGender = gender.current.value;
      if (userGender === "other") {
        userGender = otherGender.current.value;
      }
      const user = {
        username: username.current.value,
        firstName: firstName.current.value,
        lastName: lastName.current.value,
        gender: userGender,
        pronouns: pronouns.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await Axios.post("/api/v1/auth/signup", user);
        navigate("/login");
      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <section
      className="vh-100 vw-100 bg-image "
      style={{ backgroundColor: "#eee" }}
    >
      <div className="mask d-flex align-items-center h-100">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="cardContainer card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h1 className="text-uppercase text-center pb-2">
                    Welcome to <i className="title">JustBeYou</i>
                  </h1>
                  <h3 className="create text-uppercase text-center mb-5">
                    Create an account
                  </h3>

                  <form onSubmit={clickHandler}>
                    <div className="form-outline mb-1">
                      <input
                        type="text"
                        id="username"
                        ref={username}
                        required
                        className="form-control form-control-lg"
                      />
                      <label className="form-label" htmlFor="username">
                        Username
                      </label>
                    </div>

                    <div className="row">
                      <div className="col form-outline mb-1">
                        <input
                          type="text"
                          id="firstName"
                          ref={firstName}
                          required
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="firstName">
                          First Name
                        </label>
                      </div>

                      <div className="col form-outline mb-1">
                        <input
                          type="text"
                          id="lastName"
                          ref={lastName}
                          required
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="lastName">
                          Last Name
                        </label>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col form-outline mb-1">
                        <select
                          id="gender"
                          ref={gender}
                          required
                          className="form-control form-control-lg form-select"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value === "other") {
                              setShowOtherGender(true);
                            } else {
                              setShowOtherGender(false);
                            }
                          }}
                        >
                          <option value="" disabled>
                            Choose your gender
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                          <option value="transgender">Transgender</option>
                          <option value="other">Other</option>
                        </select>
                        <label className="form-label" htmlFor="gender">
                          Gender
                        </label>
                        {showOtherGender && (
                          <input
                            type="text"
                            id="otherGender"
                            ref={otherGender}
                            required
                          />
                        )}
                      </div>

                      <div className="col form-outline mb-1">
                        <select
                          id="pronouns"
                          required
                          ref={pronouns}
                          className="form-control form-control-lg form-select"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select your pronouns
                          </option>
                          <option value="he/him">He/Him</option>
                          <option value="she/her">She/Her</option>
                          <option value="they/them">They/Them</option>
                        </select>
                        <label className="form-label" htmlFor="pronouns">
                          Pronouns
                        </label>
                      </div>
                    </div>

                    <div className="form-outline mb-1">
                      <input
                        type="email"
                        id="email"
                        ref={email}
                        className="form-control form-control-lg"
                      />
                      <label className="form-label" htmlFor="email">
                        Your Email
                      </label>
                    </div>

                    <div className="row">
                      <div className="col form-outline mb-1">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          ref={password}
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="password">
                          Password{" "}
                          <button
                            className="mt-1 rounded-pill"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <BiHide size={20} />
                            ) : (
                              <BiShow size={20} />
                            )}
                          </button>
                        </label>
                      </div>

                      <div className="col form-outline mb-1">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="confirmPassword"
                          ref={confirmPassword}
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="confirmPassword">
                          Confirm password{" "}
                          <button
                            className="mt-1 rounded-pill"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <BiHide size={20} />
                            ) : (
                              <BiShow size={20} />
                            )}
                          </button>
                        </label>
                      </div>
                    </div>

                    <div className="form-check d-flex justify-content-center mb-2">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        id="agreement"
                      />
                      <label className="form-check-label" htmlFor="agreement">
                        I agree to all statements in{" "}
                        <Link to="#!" className="text-body">
                          <u>Terms of service</u>
                        </Link>
                      </label>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-warning btn-block btn-lg gradient-custom-4 text-body"
                      >
                        Register
                      </button>
                    </div>

                    <p className="text-center text-muted mt-5 mb-0">
                      Already have an account?{" "}
                      <Link className="fw-bold text-body" to="/login">
                        <u>Login here</u>
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
