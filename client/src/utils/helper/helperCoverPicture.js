import Axios from "axios";

export const updateUserCoverPicture = async (userId, coverPicture) => {
  try {
    const { data } = await Axios.put(
      "/api/v1/users/" + userId + "/coverPicture",
      {
        _id: userId,
        coverPicture,
      }
    );
    console.log("Update response.data : ", data);

    if (data.status !== 200) {
      throw new Error("Cover picture update failed");
    }
  } catch (err) {
    console.log("Error updating user cover picture", err.message);
    throw err;
  }
};
