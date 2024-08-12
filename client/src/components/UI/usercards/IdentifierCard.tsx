import React from "react";
import { IConversations, IUsers } from "../../../contexts/ConversationState";
import { getReceiverName } from "../UserCard";
import { isUser } from "./ConversationCard";
import { useConversationsHook } from "../../../hooks/conversationHooks";

interface Props {
  identifier: IConversations;
  styles?: string;
  sideProfileOpen: () => void;
}

const IdentifierCard: React.FC<Props> = ({
  identifier,
  styles,
  sideProfileOpen,
}) => {
  const receiver = !identifier.isGroup
    ? (getReceiverName({ conversation: identifier, getUser: true }) as IUsers)
    : identifier;

  const { setOpenConversationBar } = useConversationsHook();

  return (
    <li className={`conversation-li-1 ${styles}`}>
      <button
        className="w-7"
        onClick={() => {
          setOpenConversationBar(true);
        }}
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      <span
        onClick={sideProfileOpen}
        className="user-icon lg:pointer-events-none uppercase"
      >
        {identifier.isGroup
          ? identifier.groupName?.substring(0, 1)
          : isUser(receiver) && receiver && receiver.username.substring(0, 1)}
      </span>
      <h1>
        {identifier.isGroup
          ? identifier.groupName?.substring(0, 9)
          : isUser(receiver) && receiver && receiver.username.substring(0, 9)}
      </h1>
      <div className="absolute right-4 flxRowStart items-center py-1 gap-7">
        <i className="fa-solid fa-magnifying-glass absolute left-4"></i>
        <input
          type="text"
          className="rounded-full h-[2rem] w-[4rem]  pl-10 whiteBg"
        />
        <i className="text-xl icon-col fa-solid fa-video"></i>
        <i className="text-xl icon-col fa-solid fa-phone"></i>
      </div>
    </li>
  );
};

export default IdentifierCard;
