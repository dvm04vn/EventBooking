import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { FaUserCircle } from "react-icons/fa";

import styles from "./HeaderDefault.module.scss";
import Button from "~/Components/Button";
import { images } from "~/assets";
import { useAuth } from "~/context/AuthContext";

const cx = classNames.bind(styles);

const NAV_LINKS = [
  { label: "Trang chủ", path: "/" },
  { label: "Về chúng tôi", path: "/about" },
  { label: "Sự kiện", path: "/events" },
];

function HeaderDefault() {
  const { user, isAuthenticated, logout } = useAuth();
  
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const displayName = useMemo(() => {
    const name =
      user?.displayName ||
      user?.username ||
      user?.name ||
      [user?.profile?.first_name, user?.profile?.last_name]
        .filter(Boolean)
        .join(" ");
    return String(name || "").trim();
  }, [user]);

  const avatarUrl = useMemo(() => {
    return user?.avatarUrl || user?.avatar || user?.profile?.avatar || "";
  }, [user]);

  const toggleMenu = useCallback(() => setOpenMenu((v) => !v), []);
  const closeMenu = useCallback(() => setOpenMenu(false), []);

  const handleLogout = useCallback(async () => {
    closeMenu();
    await logout();
    window.location.reload();
  }, [logout, navigate, closeMenu]);

  useEffect(() => {
    if (!isAuthenticated) setOpenMenu(false);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!openMenu) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) closeMenu();
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [openMenu, closeMenu]);

  return (
    <header className={cx("wrapper")}>
      <div className={cx("container")}>
        <Link to="/" className={cx("logoLeft")} aria-label="Về trang chủ">
          <span className={cx("logo")}>
            <img src={images.logo} alt="Logo" className={cx("logoImg")} />
          </span>
          <span className={cx("logoText")}>EventBooking</span>
        </Link>

        <nav className={cx("nav")} aria-label="Main navigation">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cx("navItem", { navItemActive: isActive })
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={cx("actions", "userRight")}>
          {isAuthenticated ? (
            <div className={cx("userMenu")} ref={menuRef}>
              <button
                type="button"
                className={cx("avatarButton")}
                onClick={toggleMenu}
                aria-haspopup="menu"
                aria-expanded={openMenu}
                aria-label="Mở menu người dùng"
                title={displayName || "Tài khoản"}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName ? `Avatar ${displayName}` : "Avatar người dùng"}
                    className={cx("avatarImg")}
                  />
                ) : (
                  <FaUserCircle className={cx("avatar")} size={28} />
                )}
              </button>

              {openMenu && (
                <div className={cx("dropdown")} role="menu">
                  <div className={cx("dropdownHeader")}>
                    <div className={cx("dropdownName")}>
                      {displayName || "Tài khoản"}
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className={cx("dropdownItem")}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    Trang cá nhân
                  </Link>

                  <button
                    type="button"
                    className={cx("dropdownItem", "danger")}
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={cx("auth")}>
              <Button outline className={cx("btn_dangki")} onClick={() => navigate("/register")}>
                Đăng ký
              </Button>
              <Button primary className={cx("btn_dangnhap")} onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default HeaderDefault;
