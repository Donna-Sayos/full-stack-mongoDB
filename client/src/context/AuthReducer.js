import LOGIN_REQUEST from "./AuthActions";
import LOGIN_SUCCESS from "./AuthActions";
import LOGIN_FAILURE from "./AuthActions";
import FOLLOW from "./AuthActions";
import UNFOLLOW from "./AuthActions";

export default function AuthReducer(state, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case FOLLOW:
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };
    case UNFOLLOW:
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };
    default:
      return state;
  }
}
