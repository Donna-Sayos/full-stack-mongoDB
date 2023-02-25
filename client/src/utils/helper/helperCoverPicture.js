import Axios from "axios";

export const updateUserCoverPicture = async (userId, coverPicture) => {
  try {
    const response = await Axios.put(
      "/api/v1/users/" + userId + "/userPicture",
      {
        _id: userId,
        coverPicture,
      }
    );

    if (response.status !== 200) {
      throw new Error("Cover picture update failed");
    }
  } catch (err) {
    console.log("Error updating user cover picture", err.message);
    throw err;
  }
};
