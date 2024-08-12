import React from "react";

import UserCard from "./UI/UserCard";
import { IUsers } from "../contexts/ConversationState";
import { useConversationsHook } from "../hooks/conversationHooks";

const FriendsList: React.FC = () => {
  const { friends } = useConversationsHook();

  return (
    <ul>
      {friends &&
        friends.length &&
        friends.map((user: IUsers) => <UserCard key={user._id} user={user} />)}
    </ul>
  );
};

export default FriendsList;
