import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import IMG from "../../../../public/assets/logo.png";
import ReCAPTCHA from "react-google-recaptcha";
import Typewriter from "typewriter-effect";
import STRINGS from "./Strings";

export default function Login() {
  const [env, setEnv] = useState({});
  const [isdisabled, setIsdisabled] = useState(true);

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

                    <form className="mx-1 mx-md-4">
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="email"
                            id="email"
                            className="form-control form-control-lg"
                          />
                          <label className="form-label mt-2" htmlFor="email">
                            Your Email
                          </label>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="password"
                            id="password"
                            className="form-control form-control-lg"
                          />
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
                          type="button"
                          disabled={isdisabled}
                          className={
                            isdisabled === true
                              ? "btn btn-outline-danger btn-block btn-lg fw-bold p-3 text-body"
                              : "btn login btn-block btn-lg fw-bold p-3 text-body"
                          }
                        >
                          Login
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
                      onInit={(typewriter) => {
                        typewriter
                          .typeString("Welcome to JustBeYou!")
                          .callFunction(() => {
                            console.log("String typed out!");
                          })
                          .pauseFor(500)
                          .deleteAll()
                          .typeString(
                            "A place where you can be yourself"
                          )
                          .pauseFor(500)
                          .deleteAll()
                          .typeString("And be accepted for who you are.")
                          .pauseFor(500)
                          .deleteAll()
                          .typeString("Hope you enjoy your visit! 🤗")
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
