import { ICurrentConversation } from "../contexts/ConversationState";
import { customError } from "./authApi";

const serverUrl = import.meta.env.VITE_SERVER_URL || "";

interface sendMessage {
  receiverId?: string;
  conversationId?: string;
  message: string;
  reference?: string;
}

const getConversations = async () => {
  const response = await fetch(`${serverUrl}/get-conversations`, {
    credentials: "include",
  });

  const body = await response.json();

  if (!response.ok) {
    const error = new customError(
      body.message || "Something went wrong",
      response.status,
      body
    );

    throw error;
  }

  return body;
};

const getConversationById = async (data: ICurrentConversation) => {
  if (data == null) {
    return;
  }
  const response = await fetch(`${serverUrl}/get-current-conversation`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = await response.json();

  if (!response.ok) {
    const error = new customError(
      body.message || "Something went wrong",
      response.status,
      body
    );

    throw error;
  }

  return body;
};

const sendMessage = async (data: sendMessage) => {
  const response = await fetch(`${serverUrl}/send-message`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = await response.json();

  if (!response.ok) {
    const error = new customError(
      body.message || "Something went wrong",
      response.status,
      body
    );

    throw error;
  }

  return body;
};

const updateConversationSeenStatus = async (data: ICurrentConversation) => {
  const response = await fetch(`${serverUrl}/update-conversation-seen-status`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = await response.json();

  if (!response.ok) {
    const error = new customError(
      body.message || "Something went wrong",
      response.status,
      body
    );

    throw error;
  }

  return body;
};

const getUsers = async () => {
  const response = await fetch(`${serverUrl}/get-users`, {
    credentials: "include",
  });

  const body = await response.json();

  if (!response.ok) {
    const error = new customError(
      body.message || "Something went wrong",
      response.status,
      body
    );

    throw error;
  }

  return body;
};

const createGroup = async (data: { members: string[]; name: string }) => {
  const formatData = { ...data, members: data.members.join("_") };
  const response = await fetch(`${serverUrl}/create-group`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formatData),
  });

  const body = await response.json();

  if (!response.ok) {
    const error = new customError(
      body.message || "Something went wrong",
      response.status,
      body
    );

    throw error;
  }

  return body;
};

const addMember = async (data: {
  conversationId: string;
  members: string[];
  groupName: string;
}) => {
  const response = await fetch(`${serverUrl}/add-member`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = await response.json();

  if (!response.ok) {
    const error = new customError(
      body.message || "Something went wrong",
      response.status,
      body
    );

    throw error;
  }

  return body;
};

const kickMember = async (data: { conversationId: string; member: string }) => {
  const response = await fetch(`${serverUrl}/kick-member`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = await response.json();

  if (!response.ok) {
    const error = new customError(
      body.message || "Something went wrong",
      response.status,
      body
    );

    throw error;
  }

  return body;
};

export {
  getConversations,
  getConversationById,
  sendMessage,
  updateConversationSeenStatus,
  getUsers,
  createGroup,
  addMember,
  kickMember,
};
