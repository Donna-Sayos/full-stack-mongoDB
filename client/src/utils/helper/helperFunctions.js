import { v4 as uuidv4 } from "uuid";
import Axios from "axios";

const shortUuid = () => {
  const fullUuid = uuidv4();
  return fullUuid.substring(0, 10);
};

const incrementConvoNotification = async (conversationId) => {
  try {
    await Axios.post(`/api/v1/conversations/${conversationId}/notification`);
  } catch (err) {
    console.log(`Error incrementing notification count: ${err}`);
  }
};

const resetConvoNotification = async (conversationId) => {
  try {
    await Axios.put(`/api/v1/conversations/${conversationId}/notification`);
  } catch (err) {
    console.log(`Error resetting notification count: ${err}`);
  }
};

export { shortUuid, incrementConvoNotification, resetConvoNotification }; // Export the function so it can be used in other files
