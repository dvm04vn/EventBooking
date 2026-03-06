import React, { useMemo } from "react";
import classNames from "classnames/bind";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

import styles from "./MenuOther.module.scss";

const cx = classNames.bind(styles);

const PROVIDERS = [
  { key: "google", label: "Google", icon: <FcGoogle /> },
  { key: "facebook", label: "Facebook", icon: <FaFacebookF /> },
];

function normalizeBaseUrl(url = "") {
  const trimmed = String(url).trim();
  if (!trimmed) return "";
  return trimmed.replace(/\/+$/, ""); // bỏ dấu / cuối
}

function MenuOther({ isLogin }) {
  const baseUrl = normalizeBaseUrl(import.meta?.env?.VITE_API_URL);

  // build url 1 lần
  const providerUrls = useMemo(() => {
    if (!baseUrl) return {};
    return PROVIDERS.reduce((acc, p) => {
      acc[p.key] = `${baseUrl}/api/auth/${p.key}`;
      return acc;
    }, {});
  }, [baseUrl]);

  const canUseOauth = !!baseUrl;

  const handleProviderClick = (providerKey) => {
    const href = providerUrls?.[providerKey];
    if (!href) return;
    window.location.assign(href);
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("dividerRow")}>
        <span className={cx("dividerLine")} />
        <span className={cx("dividerLabel")}>
          {isLogin ? "Hoặc tiếp tục với" : "Hoặc đăng ký nhanh bằng"}
        </span>
        <span className={cx("dividerLine")} />
      </div>

      <div className={cx("providers")}>
        {PROVIDERS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={cx("providerBtn")}
            onClick={() => handleProviderClick(item.key)}
            disabled={!canUseOauth}
            title={
              canUseOauth
                ? `Tiếp tục với ${item.label}`
                : "Chưa cấu hình VITE_API_URL nên chưa dùng được OAuth"
            }
          >
            <span className={cx("icon")} aria-hidden="true">
              {item.icon}
            </span>
            <span className={cx("text")}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
export default MenuOther;