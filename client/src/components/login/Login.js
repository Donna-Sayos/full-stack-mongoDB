import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import IMG from "../../../../public/assets/logo.png";
import ReCAPTCHA from "react-google-recaptcha";
import Typewriter from "typewriter-effect";
import { BiShow, BiHide } from "react-icons/bi";
import { loginCalls } from "../../authLogger";
import { useAuthContext } from "../../context/AuthProvider";

export default function Login() {
  const [env, setEnv] = useState({});
  const [isdisabled, setIsdisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isFetching, dispatch } = useAuthContext();

  const navigate = useNavigate();

  async function getEnv() {
    const response = await fetch("http://localhost:5001/env");
    const env = await response.json();
    setEnv(env);
  }

  useEffect(() => {
    getEnv();
  }, []);

  const handleRecaptcha = (value) => {
    console.log("RECAPTCHA", value);
    setIsdisabled(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    loginCalls({ email, password }, dispatch);
    console.log("Logging in.......");

    navigate("/home");
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div
              className="cardContainer card text-black"
              style={{ borderRadius: "25px" }}
            >
              <div className="card-body p-md-2">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1 text-center border-right">
                    <img
                      className="mb-5 mx-1 mx-md-4 mt-2"
                      src={IMG}
                      height={200}
                      width={200}
                    />

                    <div className="mb-5 mx-1 mx-md-4">
                      <h3 className="create text-uppercase mb-3">
                        Sign in to your account
                      </h3>
                    </div>

                    <form className="mx-1 mx-md-4" onSubmit={submitHandler}>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="email"
                            id="email"
                            className="form-control form-control-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <label className="form-label mt-2" htmlFor="email">
                            Your Email
                          </label>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <div className="form-group form-outline flex-fill mb-0">
                          <div className="input-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              className="form-control form-control-lg"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
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
                      </div>
                      <div className="form-check d-flex justify-content-center mb-3">
                        <ReCAPTCHA
                          sitekey={`${env.API_KEY}`}
                          onChange={handleRecaptcha}
                        />
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-4">
                        <button
                          type="submit"
                          disabled={isdisabled}
                          className={
                            isdisabled === true
                              ? "btn btn-outline-danger btn-block btn-lg fw-bold p-3 text-body"
                              : "btn login btn-block btn-lg fw-bold p-3 text-body"
                          }
                        >
                          {isFetching ? (
                            <div
                              className="spinner-border text-danger"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          ) : (
                            "Login"
                          )}
                        </button>
                      </div>
                      <hr className="d-flex justify-content-center mx-4 mb-3 mb-lg-4" />{" "}
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-2">
                        <p className="text-center text-muted mt-4 mb-0">
                          Don't have an account?{" "}
                          <Link className="fw-bold text-body" to="/">
                            <u>Signup here</u>
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>

                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center justify-content-center order-1 order-lg-2">
                    <Typewriter
                      options={{
                        loop: true,
                        deleteSpeed: 100,
                      }}
                      onInit={(typewriter) => {
                        typewriter
                          .typeString(
                            "<h1>✨<b style='color: #ff7b7b; line-height: 2;' >JustBeYou</b>✨</h1>"
                          )
                          .typeString(
                            "<h2 style='text-align: center; line-height: 2;'>A place where</h2>"
                          )
                          .typeString(
                            "<h2 style='text-align: center; line-height: 2;'>you can be</h2>"
                          )
                          .typeString(
                            "<h2 style='text-align: center; line-height: 2; color: gray;'><i>yourself</i></h2>"
                          )
                          .typeString(
                            "<h2 style='text-align: center; line-height: 2;'>Hope you enjoy</h2>"
                          )
                          .typeString(
                            "<h2 style='text-align: center; line-height: 2;'>your visit!</h2>"
                          )
                          .typeString(
                            "<h2 style='text-align: center; line-height: 2;'>🤗🤗🤗</h2>"
                          )
                          .pauseFor(5000)
                          .start();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
