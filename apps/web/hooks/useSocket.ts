import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (url: string): Socket | undefined => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setSocket(undefined); // Set socket to undefined on error
    });

    return () => {
      newSocket.disconnect();
    };
  }, [url]);

  return socket;
};

export default useSocket;
