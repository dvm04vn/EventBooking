import { GET } from "~/Util/HttpsRequest";

/**
 * Lấy thông tin user đang đăng nhập (me)
 * Thường backend dùng: GET /auth/me
 */
export const getMe = async (config = {}) => {
    try {
        const res = await GET({
            path: "/auth/me",
            config,
        });
        return res; // AxiosResponse
    } catch (error) {
        console.error("getMe error:", error);
        throw error;
    }
};
