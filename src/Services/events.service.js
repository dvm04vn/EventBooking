import * as Requests from '~/Util/HttpsRequest';

export const getAllEvents = async () => {
    try {
        const res = await Requests.GET('/events');
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sự kiện:", error);
        return error.response?.data || { message: "Lỗi không xác định" };
    }
};

export const getEventById = async (id) => {
    try {
        const res = await Requests.GET(`/events/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết sự kiện với id ${id}:`, error);
        return error.response?.data || { message: "Lỗi không xác định" };
    }
}