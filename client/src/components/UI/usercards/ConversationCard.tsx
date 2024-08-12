import React from "react";
import { IConversations, IUsers } from "../../../contexts/ConversationState";
import { useConversationsHook } from "../../../hooks/conversationHooks";
import { useAuthContext } from "../../../hooks/authHooks";
import { formatDate } from "../../../utils/formatDate";

interface Props {
  conversation: IConversations;
}

export function isUser(object: IConversations | IUsers): object is IUsers {
  return (object as IUsers).username !== undefined;
}

const ConversationCard: React.FC<Props> = ({ conversation }) => {
  const {
    setCurrentConversation,
    currentConversation,
    setOpenConversationBar,
  } = useConversationsHook();
  const { currentUser } = useAuthContext();
  const getReceiverName = ({
    conversation,
    isId,
    getUser,
  }: {
    conversation: IConversations;
    isId?: boolean;
    getUser?: boolean;
  }): string | IUsers => {
    let receiver = conversation?.participants?.find((participant) => {
      return participant._id !== currentUser._id;
    });

    if (getUser) {
      return receiver as IUsers;
    } else if (isId) {
      return receiver?._id as string;
    }
    return receiver?.username as string;
  };

  const receiver = !conversation.isGroup
    ? (getReceiverName({ conversation, getUser: true }) as IUsers)
    : conversation;

  const unseenMessages = conversation.messages.filter(
    (message) => !message.seenBy?.includes(currentUser._id as string)
  );

  return (
    <li
      onClick={() => {
        setOpenConversationBar(false);
        conversation.isGroup
          ? setCurrentConversation({
              conversationId: conversation._id,
            })
          : setCurrentConversation({
              receiverId: getReceiverName({
                conversation,
                isId: true,
              }) as string,
            });
      }}
      className={`${
        conversation.isGroup &&
        conversation._id === currentConversation?.conversationId &&
        "sm:bg-gray-200"
      } ${
        !conversation.isGroup &&
        currentConversation?.receiverId === receiver._id &&
        "sm:bg-gray-200"
      } conversation-li-1 rounded-xl relative`}
      key={conversation._id}
    >
      <span className="user-icon uppercase">
        {conversation.isGroup && conversation.profileImageUrl ? (
          <img
            src={conversation.profileImageUrl}
            alt=""
            className="w-full h-full aspect-square object-cover"
          />
        ) : conversation.isGroup ? (
          conversation.groupName?.substring(0, 1)
        ) : isUser(receiver) && receiver.profileImageUrl ? (
          <img
            src={receiver.profileImageUrl}
            alt=""
            className="w-full h-full aspect-square object-cover"
          />
        ) : (
          isUser(receiver) && receiver.username.substring(0, 1)
        )}
      </span>
      <span>
        <h1>
          {conversation.isGroup
            ? conversation.groupName?.substring(0, 9)
            : isUser(receiver) && receiver.username.substring(0, 9)}
        </h1>
        <p
          className={`text-xs ${
            conversation.lastMessage?.seenBy &&
            !conversation.lastMessage.seenBy.includes(
              currentUser._id as string
            ) &&
            "font-bold"
          }`}
        >
          {conversation.lastMessage &&
            conversation.lastMessage?.message.slice(0, 20)}
        </p>
      </span>
      <span className="absolute right-2 flxColCenter items-end gap-2 ">
        <p className="highlightTextCol  text-xs">
          {conversation.lastMessage &&
            formatDate(conversation.lastMessage.createdAt as string)}
        </p>
        {unseenMessages.length > 0 && (
          <p className="user-icon bg-[#3399FF] w-[1.2rem] h-[1.2rem] text-xs p-1">
            {unseenMessages.length}
          </p>
        )}
      </span>
    </li>
  );
};

export default ConversationCard;
