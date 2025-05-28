import { io } from "socket.io-client";
import { BaseUrlSocket } from "../api/BaseHeader";
const accessToken = localStorage.getItem("access_token") || "";
const socket = io(BaseUrlSocket, {
  transports: ["websocket"],
  withCredentials: true, // nếu backend yêu cầu cookie/session
  auth: {
    token: accessToken, // truyền token lên server
  },
});

export default socket;
