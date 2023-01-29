import Axios from "axios";

export const loginCalls = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_REQUEST" });
  try {
    const { data } = await Axios.post("/api/v1/login", userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};
