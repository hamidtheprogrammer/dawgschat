import React from "react";
import { LogOut, conversationBarE } from "../constants/Imports";
import { IProps } from "./ConversationBar";
import { useAuthContext } from "../hooks/authHooks";

interface IChatNav extends IProps {
  changeBar: (currentBar: string) => void;
}

const ChatNav: React.FC<IChatNav> = ({ currentBar, changeBar }) => {
  const { setProfileBar } = useAuthContext();
  return (
    <nav className=" flxBtw text-xl flex-col h-full py-5 chat-nav border-r-[1px] icon-col">
      <div className="flxColStart items-center">
        <i
          onClick={() => {
            changeBar(conversationBarE.CHAT);
          }}
          className={`fa-brands fa-rocketchat ${
            currentBar === conversationBarE.CHAT && "bg-gray-200"
          }`}
        ></i>
        <i
          onClick={() => {
            changeBar(conversationBarE.FRIENDS);
          }}
          className={`fa-solid fa-user-group  ${
            currentBar === conversationBarE.FRIENDS && "bg-gray-200"
          }`}
        ></i>
        <i
          onClick={() => {
            changeBar(conversationBarE.GROUPS);
          }}
          className={`fa-solid fa-people-group  ${
            currentBar === conversationBarE.GROUPS && "bg-gray-200"
          }`}
        ></i>
      </div>
      <div className="flxColStart items-center gap-10">
        <i
          onClick={() => {
            setProfileBar(true);
          }}
          className="fa-solid fa-user"
        ></i>
        <LogOut />
      </div>
    </nav>
  );
};

export default ChatNav;
