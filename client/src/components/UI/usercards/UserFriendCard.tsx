import React from "react";
import { IUsers } from "../../../contexts/ConversationState";
import { useConversationsHook } from "../../../hooks/conversationHooks";

interface IUserCardProps {
  user?: IUsers;
}

const UserFriendCard: React.FC<IUserCardProps> = ({ user }) => {
  const { setCurrentConversation, setOpenConversationBar } =
    useConversationsHook();
  if (user)
    return (
      <li
        onClick={() => {
          setOpenConversationBar(false);
          setCurrentConversation({
            receiverId: user._id as string,
          });
        }}
        className={`conversation-li-1`}
      >
        <span className="user-icon uppercase">
          {user.username?.substring(0, 1)}
        </span>
        <h1>{user.username}</h1>
      </li>
    );
};

export default UserFriendCard;
