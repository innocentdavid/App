/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { User } from "../types";
import Hero from "./components/Main";

import "./index.css";
import axios from "axios";
import Login from "./pages/login";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const ping = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return setLoading(false);
        const response = await axios.post(
          "http://localhost:5000/verify_token",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { user } = response.data;
        setUser(user);
        // console.log("Login successful");
        setLoading(false);
      } catch (error: any) {
        localStorage.removeItem("token");
        setLoading(false);
        console.log(error);
        console.log(error.message);

        console.error("Login failed", error?.response?.data?.message);
      }
    };
    ping();
  }, []);

  return (
    <div className="bg-white h-screen text-black">
      {user ? (
        <Hero user={user} />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
