import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import { BiShow, BiHide } from "react-icons/bi";
import "./index.css";

export default function Register({ resetRecaptcha }) {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [otherGender, setOtherGender] = useState(""); // FIXME: not properly working
  const [pronouns, setPronouns] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      passwordRef.current.setCustomValidity(
        "The passwords entered don't match. Please try again."
      );
    } else {
      let userGender = gender;
      if (userGender === "other") {
        userGender = otherGender;
      }
      const newUser = {
        username,
        firstName,
        lastName,
        gender: userGender,
        pronouns,
        email,
        password,
      };
      try {
        await Axios.post("/api/v1/auth/signup", newUser);
        resetRecaptcha();
        navigate("/");
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
              <div
                className="cardContainer card"
                style={{ borderRadius: "15px" }}
              >
                <div className="card-body p-5">
                  <h1 className="text-uppercase text-center pb-2">
                    Welcome to <i className="title">JustBeYou</i>
                  </h1>
                  <h3 className="create text-uppercase text-center mb-5">
                    Create an account
                  </h3>

                  <form onSubmit={submitHandler}>
                    <div className="form-outline mb-1">
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onBlur={(e) => {
                          if (
                            !e.target.value.match(
                              /^[^\\\/\:\*\?\"\<\>\|\.\#]+$/ // regex to check for invalid characters
                            )
                          ) {
                            e.target.setCustomValidity(
                              'The characters \\ / : * ? " < > | . # are not allowed in the username.'
                            );
                          } else {
                            e.target.setCustomValidity("");
                          }
                        }}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-control form-control-lg"
                      />
                      <label className="form-label mt-2" htmlFor="username">
                        Username
                      </label>
                    </div>
                    <div className="row  mt-2">
                      <div className="col form-outline mb-1">
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="form-control form-control-lg"
                        />
                        <label className="form-label mt-2" htmlFor="firstName">
                          First Name
                        </label>
                      </div>
                      <div className="col form-outline mb-1">
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="form-control form-control-lg"
                        />
                        <label className="form-label mt-2" htmlFor="lastName">
                          Last Name
                        </label>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col form-outline mb-1">
                        <select
                          id="gender"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          required
                          className="form-control form-control-lg form-select"
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
                        <label className="form-label mt-2" htmlFor="gender">
                          Gender
                        </label>
                        {gender === "other" && (
                          <div className="form-outline mb-1">
                            <input
                              type="text"
                              id="otherGender"
                              value={otherGender}
                              onChange={(e) => setOtherGender(e.target.value)}
                              required
                              className="form-control form-control-lg"
                            />
                            <label className="form-label" htmlFor="otherGender">
                              Please specify your gender
                            </label>
                          </div>
                        )}
                      </div>

                      <div className="col form-outline mb-1">
                        <select
                          id="pronouns"
                          value={pronouns}
                          onChange={(e) => setPronouns(e.target.value)}
                          className="form-control form-control-lg form-select"
                          required
                        >
                          <option value="" disabled>
                            Select your pronouns
                          </option>
                          <option value="he/him">He/Him</option>
                          <option value="she/her">She/Her</option>
                          <option value="they/them">They/Them</option>
                        </select>
                        <label className="form-label mt-2" htmlFor="pronouns">
                          Pronouns
                        </label>
                      </div>
                    </div>
                    <div className="form-outline mb-1 mt-2">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control form-control-lg"
                      />
                      <label className="form-label mt-2" htmlFor="email">
                        Email
                      </label>
                    </div>
                    <div className="row mt-2">
                      <div className="col form-group form-outline mb-1">
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-control form-control-lg"
                          />
                          <div className="input-group-addon m-2">
                            {showPassword ? (
                              <Link
                                to=""
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <BiShow size={20} />
                              </Link>
                            ) : (
                              <Link
                                to=""
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <BiHide size={20} />
                              </Link>
                            )}
                          </div>
                        </div>
                        <label className="form-label mt-2" htmlFor="password">
                          Password
                        </label>
                      </div>

                      <div className="col form-group form-outline mb-1">
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            ref={passwordRef}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="form-control form-control-lg"
                          />
                          <div className="input-group-addon m-2">
                            {showPassword ? (
                              <Link
                                to=""
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <BiShow size={20} />
                              </Link>
                            ) : (
                              <Link
                                to=""
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <BiHide size={20} />
                              </Link>
                            )}
                          </div>
                        </div>
                        <label
                          className="form-label mt-2"
                          htmlFor="confirmPassword"
                        >
                          Confirm password
                        </label>
                      </div>
                    </div>
                    <div className="form-check d-flex justify-content-center mb-2 mt-2">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        id="agreement"
                      />
                      <label className="form-check-label" htmlFor="agreement">
                        I agree to{" "}
                        <Link to="#!" className="text-body">
                          <b>just be me</b>
                        </Link>{" "}
                        .
                      </label>
                    </div>
                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-warning btn-block btn-lg gradient-custom-4 text-body mt-2 mb-2"
                      >
                        Register
                      </button>
                    </div>
                    <hr className="d-flex justify-content-center" />{" "}
                    <p className="text-center text-muted mt-5 mb-0">
                      Already have an account?{" "}
                      <Link
                        className="fw-bold text-body"
                        to="/"
                        onClick={() => resetRecaptcha()}
                      >
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
 