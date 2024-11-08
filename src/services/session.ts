// GET ITEM BY KEY
export const getItem = (key: string) => {
  return JSON.parse(localStorage.getItem(key)!);
};

// SET ITEM (KEY, VALUE)
export const setItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// DELETE ITEM BY KEY
export const deleteItem = (key: string) => {
  localStorage.removeItem(key);
};

// Get token details
const parseJwt = (token: string): Record<string, unknown> => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload) as Record<string, unknown>;
};

// Store token into localStorage
export const saveSession = ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  setItem("access_token", accessToken);
  setItem("refresh_token", refreshToken);
};
// Delete token from localStorage
export const deleteSession = () => {
  deleteItem("access_token");
  deleteItem("refresh_token");
};

// Get user from token

export const getUserInfo = (): unknown => {
  return parseJwt(getItem("access_token"));
};
