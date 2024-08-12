import React, { ReactNode, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { createContext } from "react";
import { useAuthContext } from "../hooks/authHooks";
import { useConversationsHook } from "../hooks/conversationHooks";
import { useQueryClient } from "react-query";

interface ISocketProps {
  children: ReactNode;
}

interface ISocketContextProps {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
  onlineUsers: string[];
  setOnlineUsers: (onlineUsers: string[]) => void;
}

const defaultSocketContext = {
  socket: null,
  setSocket: () => {},
  onlineUsers: [],
  setOnlineUsers: () => {},
};

export const SocketContext =
  createContext<ISocketContextProps>(defaultSocketContext);

const SocketState: React.FC<ISocketProps> = ({ children }) => {
  const { currentUser } = useAuthContext();
  const { conversations, currentConversation } = useConversationsHook();
  const [socket, setSocket] = useState<null | Socket>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentUser.isAuthenticated) {
      const newSocket = io("http://localhost:3500", {
        query: { userId: currentUser._id },
      });

      newSocket.on("connect", () => {
        console.log("Connected to socket server with ID:", newSocket.id);
      });

      newSocket.on("get-onlineUsers", (onlineUsers) => {
        setOnlineUsers(onlineUsers);
      });

      let getGroups = conversations.filter(
        (conversation) => conversation.isGroup
      );

      let rooms: string[];

      rooms = [
        ...getGroups.map((group) => group._id),
        currentUser._id as string,
      ];

      newSocket.emit("join-room", rooms);

      newSocket.on("receive-message", (message) => {
        console.log(currentConversation);
        console.log(message.senderId._id);
        console.log(message.message);

        queryClient.invalidateQueries("getconversationbyid");
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from socket server.");
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [currentUser]);

  return (
    <SocketContext.Provider
      value={{ socket, setSocket, onlineUsers, setOnlineUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketState;
