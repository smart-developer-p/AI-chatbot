import { postService } from "../service";

//Login
export const login = async (params: unknown) => {
  const { data } = await postService("/login/", params as object);
  return data;
};

//Login
export const register = async (params: unknown) => {
  const { data } = await postService("/register/", params as object);
  return data;
};

//Verify email
export const verifyEmail = async (params: unknown) => {
  const { data } = await postService("/verify-email/", params as object);
  return data;
};
