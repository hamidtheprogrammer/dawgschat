import React from "react";
import { useAuthContext } from "../../hooks/authHooks";
import { IConversations } from "../../contexts/ConversationState";
import { IUsers } from "../../contexts/ConversationState";
import IdentifierCard from "./usercards/IdentifierCard";
import NewGroupMemberCard, {
  INewGroupMember,
} from "./usercards/NewGroupMemberCard";
import UserFriendCard from "./usercards/UserFriendCard";
import ConversationCard from "./usercards/ConversationCard";

interface IUserCardProps {
  conversation?: IConversations;
  user?: IUsers;
  newGroupMember?: INewGroupMember;
  identifier?: { user: IConversations; handleSideProfileOpen: () => void };
  styles?: string;
}

export const getReceiverName = ({
  conversation,
  isId,
  getUser,
}: {
  conversation: IConversations;
  isId?: boolean;
  getUser?: boolean;
}): string | IUsers => {
  const { currentUser } = useAuthContext();

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

const UserCard: React.FC<IUserCardProps> = ({
  conversation,
  user,
  newGroupMember,
  identifier,
  styles,
}) => {
  if (identifier) {
    return (
      <IdentifierCard
        sideProfileOpen={identifier.handleSideProfileOpen}
        identifier={identifier.user}
        styles={styles}
      />
    );
  } else if (newGroupMember) {
    return <NewGroupMemberCard newGroupMember={newGroupMember} />;
  } else if (user) {
    return <UserFriendCard user={user} />;
  } else if (conversation)
    return <ConversationCard conversation={conversation} />;
};

export default UserCard;
