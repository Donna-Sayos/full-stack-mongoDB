import { useState, useEffect } from "react";
import Axios from "axios";

export default function useFetchUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await Axios.get("/api/v1/users/");
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return users;
}
