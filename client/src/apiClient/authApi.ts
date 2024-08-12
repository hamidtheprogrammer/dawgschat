import { IAuth } from "../pages/Login";

export const serverUrl = import.meta.env.VITE_SERVER_URL || "";

export class customError extends Error {
  status;
  body;

  constructor(message: string, status: number, body: object) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

const login = async (data: IAuth) => {
  const response = await fetch(`${serverUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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

const register = async (data: IAuth) => {
  const response = await fetch(`${serverUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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

const verifyToken = async () => {
  const response = await fetch(`${serverUrl}/verify-token`, {
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

const logout = async () => {
  const response = await fetch(`${serverUrl}/logout`, {
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

const updateProfile = async (data: FormData) => {
  const response = await fetch(`${serverUrl}/update-profile`, {
    method: "POST",
    credentials: "include",
    body: data,
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

const getProfile = async () => {
  const response = await fetch(`${serverUrl}/get-profile`, {
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

export { login, register, verifyToken, logout, updateProfile, getProfile };
