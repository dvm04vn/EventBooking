import * as Response from '~/Util/HttpsRequest'

export const getMe = async() => {
    try {
        const res = await Response.POST('user/me');
        return res;
    } catch (error) {
        const status = error?.status || error?.response?.status;
        const data = error?.response?.data;
        return {...data, status};
    }
}
