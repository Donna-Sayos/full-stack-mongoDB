const LOGIN_REQUEST = "LOGIN_REQUEST";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAILURE = "LOGIN_FAILURE";
const FOLLOW = "FOLLOW";
const UNFOLLOW = "UNFOLLOW";

export const loginRequest = (userCredential) => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailure = () => ({
  type: LOGIN_FAILURE,
});

export const follow = (userId) => ({
  type: FOLLOW,
  payload: userId,
});

export const unfollow = (userId) => ({
  type: UNFOLLOW,
  payload: userId,
});
