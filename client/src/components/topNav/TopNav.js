import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";

export default function TopNav() {
  const [FR, setFR] = useState({});
  const { user } = useAuthContext();

  async function getEnv() {
    const response = await fetch("http://localhost:5001/env");
    const env = await response.json();
    setFR(env);
    console.log("FR", FR.FILES_ROUTE);
  }

  useEffect(() => {
    getEnv();
  }, []);

  return <div>TopNav</div>;
}
