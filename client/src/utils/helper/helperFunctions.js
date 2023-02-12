import { v4 as uuidv4 } from "uuid";

export const shortUuid = () => {
  const fullUuid = uuidv4();
  return fullUuid.substring(0, 10);
}
