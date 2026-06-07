// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
// import { FaUserCircle } from "react-icons/fa";

import styles from "./HeaderDefault.module.scss";
import Button from "~/Components/Button";
import images from "~/assets";
// import { useAuth } from "~/context/AuthContext";

const cx = classNames.bind(styles);

const LIST_NAV = [
  { title: "Trang chủ", path: "/" },
  { title: "Về chúng tôi", path: "/about" },
  { title: "Sự kiện", path: "/events" },
];

function HeaderDefault() {
  // const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();

  return (
    <header className={cx("wrapper")}>
      <div className={cx("container")}>
        <h1 className={cx("logo")}>
          <Link to="/" className={cx("logoLeft")}>
            <img src={images.LogoUrl} alt="Logo" className={cx("logoImg")} />
            <span className={cx("logoText")}>EventBooking</span>
          </Link>
        </h1>
        <nav className={cx("nav")}>
          {LIST_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cx("navItem", { navItemActive: isActive })
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className={cx("auth")}>
          <Button
            outline
            className={cx("btn_dangki")}
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </Button>
          <Button
            primary
            className={cx("btn_dangnhap")}
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    </header>
  );
}

export default HeaderDefault;
