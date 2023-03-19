import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import IMG from "../../../../../public/assets/others/logo.png";
import ReCAPTCHA from "react-google-recaptcha";
import Typewriter from "typewriter-effect";
import { BiShow, BiHide } from "react-icons/bi";
import { loginCalls } from "../../../utils/authLogger";
import { useAuthContext } from "../../../context/auth/AuthProvider";

export default function Login({
  handleRecaptcha,
  resetRecaptcha,
  isdisabled,
  recaptchaRef,
}) {
  const [env, setEnv] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isFetching, dispatch } = useAuthContext();

  const navigate = useNavigate();

  async function getEnv() {
    const { data } = await Axios.get("/env");
    setEnv(data);
  }

  useEffect(() => {
    getEnv();
  }, []);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      await loginCalls({ email, password }, dispatch);

      navigate("/");
    } catch (err) {
      console.error(err);
    }
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
                            className="box form-control form-control-lg"
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
                          ref={recaptchaRef}
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
                          <Link
                            className="fw-bold text-body"
                            to="/signup"
                            onClick={() => resetRecaptcha()}
                          >
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
                          .typeString(
                            "<h1>✨<b style='color: #ff7b7b; line-height: 2;' >JustBeYou</b>✨</h1>"
                          )
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
