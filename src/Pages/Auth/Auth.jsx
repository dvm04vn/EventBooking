import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./Auth.module.scss";
import Login from "./Components/Login";
import Register from "./Components/Register";
import MenuOther from "./Components/MenuOther";

const cx = classNames.bind(styles);

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = useMemo(() => {
    const path = (location.pathname || "").toLowerCase();
    return path === "/login"; // chuẩn theo route của bạn
  }, [location.pathname]);

  const { title, subtitle } = useMemo(() => {
    if (isLogin) {
      return {
        title: "Chào mừng trở lại!",
        subtitle: "Đăng nhập để tiếp tục khám phá sự kiện.",
      };
    }
    return {
      title: "Tạo tài khoản mới",
      subtitle: "Bắt đầu hành trình khám phá sự kiện của bạn.",
    };
  }, [isLogin]);

  const handleSwitchMode = useCallback(() => {
    navigate(isLogin ? "/register" : "/login", { replace: true });
  }, [isLogin, navigate]);

  return (
    <div className={cx("wrapper", isLogin ? "modeLogin" : "modeRegister")}>
      <div className={cx("brand")} role="banner" aria-label="EventBooking">
        EventBooking
      </div>

      <div className={cx("card")}>
        <header className={cx("cardHeader")}>
          <h1 className={cx("cardTitle")}>{title}</h1>
          <p className={cx("cardSubtitle")}>{subtitle}</p>
        </header>

        <div className={cx("cardBody")}>
          <div className={cx("content")}>
            {isLogin ? <Login /> : <Register />}
          </div>

          <div className={cx("other")}>
            <MenuOther isLogin={isLogin} />
          </div>
        </div>

        <footer className={cx("cardFooter")}>
          <span className={cx("switchText")}>
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
          </span>

          <button
            type="button"
            className={cx("switchButton")}
            onClick={handleSwitchMode}
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default Auth;
