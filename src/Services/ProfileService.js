// src/Services/ProfileService.js
import { GET, PUT } from "~/Util/HttpsRequest";


/**
 * Lấy profile của chính mình
 * Một số backend dùng: GET /auth/profile
 */
export const getMyProfile = async (config = {}) => {
  try {
    const res = await GET({
      path: "/auth/profile",
      config,
    });
    return res; // AxiosResponse
  } catch (error) {
    console.error("getMyProfile error:", error);
    throw error;
  }
};

/**
 * Update profile của chính mình
 * updates: object (vd: { first_name, last_name, bio, avatar... })
 * Backend: PUT /auth/profile
 */
export const updateProfile = async (updates = {}, config = {}) => {
  try {
    const res = await PUT({
      path: "/auth/profile",
      data: updates,
      config,
    });
    return res; // AxiosResponse
  } catch (error) {
    console.error("updateProfile error:", error);
    throw error;
  }
};
