import * as Response from '~/Util/HttpsRequest';

export const login = async ({email, password}) => {
    try {
        const res = await Response.POST('/auth/login', {email,password});
        return res;
    } catch (error) {
        const status = error?.status || error?.response?.status;
        const data = error?.response?.data;
        return {...data, status};
    }
}

export const register = async({full_name, email, password}) => {
    try {
        const res = await Response.POST('/auth/register', {full_name, email, password});
        return res;
    } catch (error) {
        const status = error?.status || error?.response?.status;
        const data = error?.response?.data;
        return {...data, status};
    }
}

export const logout = async() => {
    try {
        const res = await Response.POST('/auth/logout');
        return res;
    } catch (error) {
        const status = error?.status || error?.response?.status;
        const data = error?.response?.data;
        return {...data, status};
    }
}

