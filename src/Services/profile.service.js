import * as Request from '~/Util/HttpsRequest';


export const getProfileid = async () => {
  try {
    const res = await Request.GET({
      path: "/auth/profile",
    });
    return res;
  } catch (error) {
    console.error("getProfileid error:", error);
    throw error;

  }
}


export const updateProfile = async (data) => {
  try {
    const res = await Request.PUT({
      path: "/auth/profile",
      data: data,
    });
    return res;
  } catch (error) {
    console.error("updateProfile error:", error);
    throw error;
  }
};

