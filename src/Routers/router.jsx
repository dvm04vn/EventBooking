// import page
import Home from "~/Pages/Home";
import Events from "~/Pages/Events";
import EventDetail from "~/Pages/EventDetail";
import CheckoutSuccess from "~/Pages/CheckoutSuccess";
import Auth from "~/Pages/Auth";
import Profile from "~/Pages/Profile/Profile";
import About from "~/Pages/About";
import Booking from "~/Pages/Booking";
import Payment from "~/Pages/Payment";
// improt layout
import DetailLayout from "~/Layout/DetailLayout";
import DefaultLayout from "~/Layout/DefaultLayout";


// PUBLIC ROUTES
export const PublicRouter = [
  {
    path: "/",
    component: Home,
    layout: DefaultLayout,
  },
  {
    path: "/about",
    component: About,
    layout: DefaultLayout,
  },
  {
    path: "/events",
    component: Events,
    layout: DefaultLayout,
  },
  {
    path: "/events/:eventId",
    component: EventDetail,
    layout: DetailLayout,
  },
  {
    path: "/events/:id/booking",
    component: Booking,
    layout: DetailLayout,
  },
  {
    path: "/events/:id/payment",
    component: Payment,
    layout: DetailLayout,
  },
  {
    path: "/checkout/:eventId/success",
    component: CheckoutSuccess,
    layout: DefaultLayout,
  },
  {
    path: "/login",
    component: Auth,
    layout: DetailLayout,
  },
  {
    path: "/register",
    component: Auth,
    layout: DetailLayout,
  },
  {
    path: "/profile",
    component: Profile,
    layout: DetailLayout,
  },
];

// USER ROUTES
export const UserRouter = [
 
];

// ADMIN ROUTES
export const AdminRouter = [
  // sau này thêm
];
