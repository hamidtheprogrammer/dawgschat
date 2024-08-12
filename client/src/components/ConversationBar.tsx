import React from "react";
import {
  ConversationList,
  conversationBarE,
  FriendsList,
} from "../constants/Imports";

export interface IProps {
  currentBar: string;
}

const ConversationBar: React.FC<IProps> = ({ currentBar }) => {
  return (
    <>
      <div className="relative flxColCenter py-1">
        <i className="fa-solid fa-magnifying-glass absolute left-4"></i>
        <input
          type="text"
          placeholder="Search"
          className="rounded-md h-[2rem] w-full pl-10 grayBg"
        />
      </div>
      {currentBar === conversationBarE.CHAT ? (
        <ConversationList />
      ) : (
        currentBar === conversationBarE.FRIENDS && <FriendsList />
      )}
    </>
  );
};

export default ConversationBar;
