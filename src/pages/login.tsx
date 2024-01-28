/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
// import { User } from "../../types";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

// { user, setUser }: { user: User; setUser: any }
export default function Login() {
  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState("test_user");
  const [password, setPassword] = useState("password");
  const [errorMsg, setErrorMsg] = useState("");
  const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const handleOpen = () => setOpen(!open);

  const handleLogin = async () => {
    if (!username || !password) {
      if (!username) {
        setUsernameErrorMsg("Please enter a username");
      }
      if (!password) {
        setPasswordErrorMsg("Please enter a password");
      }
      return;
    }
    try {
      setLoggingIn(true);
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      // console.log(response);
      // console.log("response");

      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem("token", access_token);
        // console.log("Login successful");
        setOpen(false);
        window.location.reload();
        setLoggingIn(false);
      } else {
        // console.log(response);
        setLoggingIn(false);
        setErrorMsg(response?.data?.message);
      }
    } catch (error: any) {
      setLoggingIn(false);
      console.error("Login failed", error?.response?.data?.message);
    }
  };

  return (
    <>
      <Navbar setLoginModalOpen={setOpen} user={null} />
      <Dialog
        open={open}
        handler={handleOpen}
        placeholder={undefined}
        size={"md"}
      >
        <DialogHeader placeholder={undefined}>Login now</DialogHeader>
        <DialogBody placeholder={undefined}>
          <div className="flex flex-col md:flex-row items-center w-full gap-3">
            <div className="w-full">
              <Input
                crossOrigin={undefined}
                className="w-full"
                label="Username"
                color="blue"
                value={username}
                onChange={(e) => {
                  setUsernameErrorMsg("");
                  setUsername(e.target.value);
                }}
                error={usernameErrorMsg ? true : false}
                // success={false}
              />
              {usernameErrorMsg && (
                <p className="text-red-600">{usernameErrorMsg}</p>
              )}
            </div>
            <div className="w-full">
              <Input
                // type="password"
                crossOrigin={undefined}
                placeholder="Password"
                className="w-full"
                color="blue"
                label="Password"
                value={password}
                onChange={(e) => {
                  setPasswordErrorMsg("");
                  setPassword(e.target.value);
                }}
                error={passwordErrorMsg ? true : false}
                // success={false}
              />
              {passwordErrorMsg && (
                <p className="text-red-600">{passwordErrorMsg}</p>
              )}
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-red-600">{errorMsg}</p>
          </div>
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
            placeholder={undefined}
            loading={loggingIn}
          >
            <span>Cancel</span>
          </Button>
          <Button
            loading={loggingIn}
            variant="gradient"
            color="green"
            onClick={handleLogin}
            placeholder={undefined}
          >
            <span>Login</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
