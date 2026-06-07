import * as Response from "~/Util/HttpsRequest";

export const getProfile = async () => {
  try {
    const res = await Response.GET("/profile");
    return res;
  } catch (error) {
    const status = error?.status || error?.response?.status;
    const data = error?.response?.data;
    return { ...data, status };
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await Response.PUT("/profile");
    return res;
  } catch (error) {
    console.error("updateProfile error:", error);
    throw error;
  }
};
