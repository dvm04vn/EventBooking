import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { RiLoader2Fill } from "react-icons/ri";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import styles from "./Login.module.scss";
import { login } from "~/Services/auth.service";

const cx = classNames.bind(styles);

function Login() {
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [warning, setWarning] = useState("");
  const [warningPass, setWarningPass] = useState("");
  const [loading, setLoading] = useState(false);

  const isDisabled =
    loginIdentifier.trim().length < 6 || password.length < 8 || loading;

  useEffect(() => {
    const v = loginIdentifier.trim();
    if (!v) return setWarning("");
    if (v.length < 6) return setWarning("Ít nhất 6 ký tự");
    setWarning("");
  }, [loginIdentifier]);

  useEffect(() => {
    if (!password) return setWarningPass("");
    if (password.length < 8) return setWarningPass("Mật khẩu ít nhất 8 ký tự");
    setWarningPass("");
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    setLoading(true);
    setWarning("");
    setWarningPass("");

    try {
      const result = await login(loginIdentifier.trim(), password);

      if (result?.error === "Email") {
        setWarning(result?.message || "Thông tin đăng nhập không hợp lệ");
        return;
      }

      if (result?.error === "Pass") {
        setWarningPass(result?.message || "Mật khẩu không đúng");
        return;
      }

      const token =
        result?.meta?.newAccessToken || result?.accessToken || result?.token;

      if (!token) {
        setWarning("Đăng nhập thất bại, vui lòng thử lại");
        return;
      }

      // ✅ ĐÚNG KEY của dự án bạn
      localStorage.setItem("accessToken", token);

      // ✅ Reload + chuyển về trang chủ (đảm bảo AuthProvider init lại)
      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
      setWarning(err?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cx("form")}>
      <div className={cx("form-group")}>
        <label htmlFor="loginIdentifier">Email hoặc Username</label>
        <input
          id="loginIdentifier"
          type="text"
          placeholder="Nhập email hoặc username"
          value={loginIdentifier}
          onChange={(e) => setLoginIdentifier(e.target.value)}
          autoComplete="username"
          disabled={loading}
        />
        {warning && <span className={cx("error")}>{warning}</span>}
      </div>

      <div className={cx("form-group", "password-group")}>
        <label htmlFor="password">Mật khẩu</label>

        <div className={cx("password-wrapper")}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
          />

          <button
            type="button"
            className={cx("btn-eye")}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            disabled={loading}
          >
            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>

        {warningPass && <span className={cx("error")}>{warningPass}</span>}
      </div>

      <button type="submit" className={cx("submit")} disabled={isDisabled}>
        {loading ? (
          <div className={cx("loading")}>
            <RiLoader2Fill className={cx("spin")} />
            <span className={cx("buttonText")}>Đang đăng nhập...</span>
          </div>
        ) : (
          <span className={cx("buttonText")}>Đăng nhập</span>
        )}
      </button>
    </form>
  );
}

export default Login;
