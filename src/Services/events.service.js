import * as Response from '~/Util/HttpsRequest';

export const getAllEvents = async () => {
    try {
        const res = await Response.GET('/events');
        return res;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sự kiện:", error);
        return error.response?.data || { message: "Lỗi không xác định" };
    }
};

export const getEventById = async (id) => {
    try {
        const res = await Response.GET(`/events/${id}`);
        return res;
    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết sự kiện với id ${id}:`, error);
        return error.response?.data || { message: "Lỗi không xác định" };
    }
}