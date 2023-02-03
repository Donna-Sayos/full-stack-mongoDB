export const loginRequest = (userCredential) => ({
  type: "LOGIN_REQUEST",
});

export const loginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const loginFailure = () => ({
  type: "LOGIN_FAILURE",
});

export const follow = (userId) => ({
  type: "FOLLOW",
  payload: userId,
});

export const unfollow = (userId) => ({
  type: "UNFOLLOW",
  payload: userId,
});
