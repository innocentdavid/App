/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Navbar from "./Navbar";
import { FaTimes } from "react-icons/fa";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import { User } from "../../types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MAX_STORED_LOG_LENGTH } from "../config";

const sensorEndpoint = "http://localhost:5000";
const socket = io(sensorEndpoint, {
  reconnection: true,
  transports: ["websocket"],
}) as Socket;

const ROOMS = ["log1", "log2", "log3"];

const Hero = ({ user }: { user: User | null }) => {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [room, setRoom] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const logBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storageKey = "logData";
    const existingLogs = JSON.parse(localStorage.getItem(storageKey)!) || [];
    setLogs(existingLogs);

    const activeLogs = JSON.parse(localStorage.getItem("activeLogs")!) || [];
    setActiveLogs(activeLogs);

    setTimeout(() => {
      if (logBodyRef.current) {
        logBodyRef.current?.lastElementChild?.scrollIntoView({});
        // el.scrollIntoView({ behavior: "smooth" });
      } else {
        console.log("el not found!");
      }
    }, 1000);
  }, [logBodyRef]);

  useEffect(() => {
    function addLogToStorage(newLog: string) {
      const storageKey = "logData";
      // Get existing logs from localStorage
      let existingLogs = JSON.parse(localStorage.getItem(storageKey)!) || [];

      // Add the new log
      existingLogs.push(newLog);

      // Ensure the array does not exceed the maximum length
      if (existingLogs.length > MAX_STORED_LOG_LENGTH) {
        // If it exceeds, remove the oldest entries
        existingLogs = existingLogs.slice(
          existingLogs.length - MAX_STORED_LOG_LENGTH
        );
      }

      // Save the updated array back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(existingLogs));
    }

    socket.on("log_data", (data) => {
      // console.log("Received log data:", data.log);
      const log: string = data.log;
      if (log.includes("0")) {
        setErrorMessage(`Error: ${log}`);
      }
      setLogs((prev) => {
        // Check for duplicates before adding
        if (!prev.includes(data.log)) {
          return [...prev, data.log];
        }
        return prev; // If duplicate, return the existing state unchanged
      });

      addLogToStorage(data.log);

      // const el = document.getElementById(`log_${logs.length + 1}`);
      const parent = document.getElementById("logBody");
      if (parent && parent.lastElementChild) {
        parent.lastElementChild.scrollIntoView({ behavior: "smooth" });
        // el.scrollIntoView({ behavior: "smooth" });
      } else {
        console.log("el not found!");
      }
    });

    // return () => {
    //     socket.disconnect();
    //     console.log("Disconnected from the server!");
    // };
  }, [logs]);

  const handleStopLogForRoom = (room: string) => {
    if (
      window.confirm("Are you sure you want to stop logs for " + room + "?")
    ) {
      setActiveLogs(activeLogs.filter((logRoom) => logRoom !== room));
      localStorage.setItem(
        "activeLogs",
        JSON.stringify(activeLogs.filter((logRoom) => logRoom !== room))
      );
      socket.emit("stop_logging", { room_name: room });
      console.log("stopped logging for " + room);
    }
  };

  return (
    <div className="h-screen relative">
      <ToastContainer />
      <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} />

      <div className="h-[25%] overflow-auto">
        <Navbar
          setLoginModalOpen={setLoginModalOpen}
          user={user}
          socket={socket}
        />
        <div className="w-full px-[4rem] pt-[40px]">
          <form
            className="flex w-full h-full items-center gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              // room && setCollectLog(true);

              if (room && activeLogs.includes(room)) {
                toast("You've already started this log!");
                return;
              }

              if (room) {
                // console.log("room: " + room);
                toast("will start logging data from " + room);
                setRoom("");
                // console.log(room);
                const activeLogs: string[] =
                  JSON.parse(localStorage.getItem("activeLogs")!) || [];
                setActiveLogs([...activeLogs, room]);
                localStorage.setItem(
                  "activeLogs",
                  JSON.stringify([...activeLogs, room])
                );

                socket.emit("start_logging", {
                  room_name: room,
                  username: user?.username,
                });
              }
            }}
          >
            <div className="whitespace-nowrap text-lg">Select session</div>
            <div
              onClick={() => setOpen(!open)}
              className="w-full flex items-center gap-10 justify-center bg-gray-200 rounded-xl text-black px-4"
            >
              <button
                type="button"
                className="w-full cursor-pointer flex items-center gap-3 justify-between  rounded-xl h-[50px]"
              >
                <h1 className="text-[20px] ">{room || "Select"}</h1>
              </button>
              <div className="  px-2 py-1 w-[50px] rounded-lg flex items-center justify-center">
                <IoIosArrowDown className="text-[25px]" />
              </div>
            </div>
            <button
              type="submit"
              className=" w-[100px] cursor-pointer bg-gray-200 text-black flex items-center  gap-3 justify-center  rounded-xl h-[50px]"
            >
              <h1 className="text-[20px] px-4 py-2">Start</h1>
            </button>
          </form>

          {/* {open && <Dropdown />} */}
          {open && (
            <div className="absolute top-[160px] z-10 left-1/2 -translate-x-1/2 max-w-[600px] w-full min-h-[150px] flex  bg-black rounded-lg mt-4 text-white duration-700 py-4">
              <div className="flex flex-col items-start justify-start px-4 w-full gap-4 h-auto">
                {ROOMS.map((room, i) => {
                  return (
                    <div
                      key={`room_-${i + 1}`}
                      className="hover:bg-gray-500 transition-all duration-200 rounded-md w-full  h-10  flex items-center justify-start px-6  cursor-pointer"
                      onClick={() => {
                        setRoom(room);
                        setOpen(false);
                      }}
                    >
                      {room}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-[75%] overflow-auto px-[4rem] pt-[40px] flex flex-col items-start justify-center  w-full py-[4rem] relative">
        <div
          className={`${
            !errorMessage && "opacity-0 -ml-[100vw]"
          } transition-all duration-700 fixed bottom-3 left-1/2 -translate-x-1/2 text-red-600 flex items-center gap-3`}
        >
          <p className="">{errorMessage}</p>
          <FaTimes
            className="cursor-pointer"
            onClick={() => setErrorMessage("")}
          />
        </div>

        {activeLogs.length > 0 && (
          <div className="flex items-center gap-2">
            Active:
            {activeLogs.map((logRoom: string, i: number) => {
              return (
                <div key={logRoom} className="w-full flex items-center gap-1">
                  <span>{logRoom}</span>
                  <div
                    className="bg-red-600 rounded-full p-1 cursor-pointer"
                    onClick={() => handleStopLogForRoom(logRoom)}
                  >
                    <FaTimes size={8} color="white" />
                  </div>
                  {activeLogs.length !== i + 1 && (
                    <span className="mx-2">|</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div
          className="w-full max-w-[500px] lg:max-w-[100%] h-full text-[20px] rounded-lg  bg-gray-300 text-black px-4 py-4 overflow-auto  border-none flex flex-col gap-1 p-2 pb-20"
          id="logBody"
          ref={logBodyRef}
        >
          {logs.map((log, i) => {
            return (
              <div
                key={`log_-${i}`}
                id={`log_${i + 1}`}
                className="flex items-center gap-3 mb-3"
              >
                <MdKeyboardDoubleArrowRight />
                {log}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Hero;

const LoginModal = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
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
        console.log(response);
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
};
