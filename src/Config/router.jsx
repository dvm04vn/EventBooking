export const router = {
  // Public
  HOME: "/",
  EVENTS: "/events",
  EVENT_DETAIL: "/events/:eventId",

  // Booking flow (User)
  CHECKOUT: "/checkout/:eventId",
  BOOKING_INFO: "/booking/:eventId/info",
  BOOKING_SUCCESS: "/booking/:eventId/success",

  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
};
