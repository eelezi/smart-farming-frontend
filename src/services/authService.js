import { post, get } from "./api";

export const login = async ({ email, password }) => {
  const data = await post("/auth/login", { email, password });
  if (data.token) localStorage.setItem("authToken", data.token);
  localStorage.setItem("user", JSON.stringify({
    userId: data.userId,
    name: data.name,
    email: data.email,
  }));
  return data;
};

export const register = async ({ name, email, password }) => {
  const data = await post("/auth/register", { name, email, password });
  if (data.token) localStorage.setItem("authToken", data.token);
  localStorage.setItem("user", JSON.stringify({
    userId: data.userId,
    name: data.name,
    email: data.email,
  }));
  return data;
};

export const getCurrentUser = async () => {
  return await get("/auth/me");
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => !!localStorage.getItem("authToken");
