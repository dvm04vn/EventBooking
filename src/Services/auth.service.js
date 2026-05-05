import { POST } from "~/Util/HttpsRequest";

export const login = async (email, password, config = {}) => {
  try {
    const res = await POST({
      path: "/auth/login",
      data: { email, password },
      config,
    });
    return res;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (username, email, password, config = {}) => {
  try {
    const res = await POST({
      path: "/auth/register",
      data: { username, email, password },
      config,
    });
    return res;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export const logout = async (config = {}) => {
  try {
    const res = await POST({
      path: "/auth/logout",
      data: undefined, // hoặc {} nếu backend cần body
      config,
    });
    return res;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
export const refresh = async () => {
  try {
    const res = await POST("auth/refresh");
    return res.data;
  } catch (error) {
    // network / CORS / server down
    if (!error?.response) {
      throw new Error("Network error");
    }

    const status = error.response.status;
    const message = error.response.data?.message || "Refresh failed";

    // Token invalid/expired -> auth fail
    if (status === 401 || /jwt/i.test(message)) {
      throw new Error("jwt expired");
    }

    throw new Error(message);
  }
};
