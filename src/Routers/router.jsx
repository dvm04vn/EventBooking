// import page
import Home from "~/Pages/Home";
import Events from "~/Pages/Events";
import EventDetail from "~/Pages/EventDetail";
import Checkout from "~/Pages/Checkout";
import CheckoutInfo from "~/Pages/CheckoutInfo";
import CheckoutSuccess from "~/Pages/CheckoutSuccess";
import Auth from "~/Pages/Auth";
// improt layout
import DetailLayout from "~/Layout/DetailLayout";
import DefaultLayout from "~/Layout/DefaultLayout";
import Profile from "~/Pages/Profile/Profile";

// PUBLIC ROUTES
export const PublicRouter = [
  {
    path: "/",
    component: Home,
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
    path: "/checkout/:eventId",
    component: Checkout,
    layout: DetailLayout,
  },
  {
    path: "/checkout/:eventId/info",
    component: CheckoutInfo,
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
  // {
  //   path: "/profile",
  //   component: Profile,
  //   layout: DetailLayout,
  // },
];

// USER ROUTES
export const UserRouter = [
  {
    path: "/profile",
    component: Profile,
    layout: DetailLayout,
  },
];

// ADMIN ROUTES
export const AdminRouter = [
  // sau này thêm
];
