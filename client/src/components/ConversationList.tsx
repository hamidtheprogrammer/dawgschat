import React from "react";
import { useConversationsHook } from "../hooks/conversationHooks";
import UserCard from "./UI/UserCard";

const ConversationList: React.FC = () => {
  const { conversations } = useConversationsHook();
  return (
    <>
      <ul className="full flxColStart py-4 gap-1">
        {conversations && conversations.length ? (
          conversations.map((conversation) => (
            <UserCard key={conversation._id} conversation={conversation} />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </ul>
    </>
  );
};

export default ConversationList;
