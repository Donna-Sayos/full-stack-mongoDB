import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import { BiShow, BiHide } from "react-icons/bi";

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
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Kinker</h3>
          <span className="loginDesc">What happens here, stays here 🤫.</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={clickHandler}>
            <input
              id="username"
              placeholder="username..."
              required
              ref={username}
              className="loginInput"
            />
            <label htmlFor="username">Username</label>
            <input
              id="firstName"
              placeholder="first name..."
              ref={firstName}
              className="loginInput"
              required
            />
            <label htmlFor="firstName">First Name</label>
            <input
              id="lastName"
              placeholder="last name..."
              ref={lastName}
              className="loginInput"
              required
            />
            <label htmlFor="lastName">Last Name</label>
            <select
              id="gender"
              placeholder="gender..."
              required
              ref={gender}
              className="loginInput"
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
              <option value="other">Other</option>
            </select>
            {showOtherGender && (
              <input
                id="otherGender"
                placeholder="other..."
                ref={otherGender}
                required
              />
            )}
            <label htmlFor="gender">Gender</label>
            <select
              id="pronouns"
              required
              ref={pronouns}
              className="loginInput"
              defaultValue=""
            >
              <option value="" disabled>
                Select your pronouns
              </option>
              <option value="he/him">He/Him</option>
              <option value="she/her">She/Her</option>
              <option value="they/them">They/Them</option>
            </select>
            <label htmlFor="pronouns">Pronouns</label>
            <input
              id="email"
              placeholder="email..."
              ref={email}
              required
              type="email"
            />
            <label htmlFor="email">Email</label>
            <input
              id="password"
              placeholder="password..."
              ref={password}
              required
              type={showPassword ? "text" : "password"}
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <BiHide size={25} /> : <BiShow size={25} />}
            </button>
            <label htmlFor="password">Password</label>
            <input
              id="confirmPassword"
              placeholder="confirm password..."
              ref={confirmPassword}
              required
              type={showPassword ? "text" : "password"}
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <BiHide size={25} /> : <BiShow size={25} />}
            </button>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <button className="loginBtn" type="submit">
              Sign Up
            </button>
            <hr className="my-4" />{" "}
            <p className="loginDesc">
              Already have an account?
              <Link to="/login">
                <button>Sign In</button>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
