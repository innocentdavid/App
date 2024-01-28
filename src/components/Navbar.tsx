/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { User } from "../../types";
import { Socket } from "socket.io-client";

const Navbar = ({
  setLoginModalOpen,
  user,
  socket,
}: {
  setLoginModalOpen: any;
  user: User | null;
  socket: Socket | null;
}) => {
  const showReg = false;
  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/register", {
        username: "test_user",
        password: "password",
      });
      if (res.status === 200) {
        // console.log("User registered successfully");
        alert("test_user registered successfully!. password: password");
      } else {
        console.log("failed to register test_user. res:");
        console.log(res);
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Registration failed", error.response.data.message);
    }
  };

  const handleLogOut = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("logData");
    localStorage.removeItem("activeLogs");
    if (socket) {
      socket.emit("stop_all_logs");
      console.log("disconnected");
    }
    window.location.reload();
  };

  return (
    <nav className="w-full px-[4rem] mx-auto border-b-2 bg-gray-200 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <a href="/" className="">
            Home
          </a>
          {user && <div className="cursor-pointer">Settings</div>}
        </div>

        <div className="hidden md:flex items-center justify-center ">
          {!user ? (
            <ul className="flex items-center gap-8">
              <li className="text-white font-semibold duration-500">
                <Button
                  placeholder={""}
                  onClick={() => setLoginModalOpen(true)}
                  // variant="gradient"
                  className="bg-white text-black hover:text-black/70"
                >
                  Login
                </Button>
              </li>
              {showReg && (
                <li className="text-white font-semibold duration-500">
                  <Button
                    placeholder={""}
                    onClick={() => handleRegister()}
                    // variant="gradient"
                    className="bg-white text-black hover:text-black/70"
                  >
                    Register (test_user)
                  </Button>
                </li>
              )}
            </ul>
          ) : (
            <div className="flex items-center gap-3">
              <div className="">Welcome {user.username}</div>
              <Button onClick={handleLogOut} placeholder={undefined}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
