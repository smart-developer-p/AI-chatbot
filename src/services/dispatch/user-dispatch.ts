import { getService, postService, putService } from "../service";

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
export const reverifyEmail = async (params: { email: string }) => {
  const { data } = await postService("/resend-verification/", params);
  return data;
};

export const updateProfile= async (params:{full_name:string,email:string})=>{
  const {data}= await putService('/profile/',params)
  return data
}

export const getConnectedDevices= async()=>{
  const {data} = await getService('/devices/')
  return data
}

export const logoutAllDevices = async ()=>{
  const {data} =await postService('/logout-all/',{})
  return data
}

