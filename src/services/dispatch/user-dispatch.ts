import { postService } from "../service";

// Login
export const login = async (params: unknown) => {
  const { data } = await postService("/login/", params as object);
  return data;
};

// Register
export const register = async (params: unknown) => {
  const { data } = await postService("/register/", params as object);
  return data;
};

// Verify email
export const verifyEmail = async (params: { uidb64: string; token: string }) => {
  const { data } = await postService("/verify-email/", params);
  return data;
};

// ReVerify email
export const reverifyEmail = async (params: { uidb64: string; token: string }) => {
  const { data } = await postService("/resend-verification/", params);
  return data;
};