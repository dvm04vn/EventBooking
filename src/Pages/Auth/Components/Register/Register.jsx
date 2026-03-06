import classNames from "classnames/bind";
import { useEffect, useMemo, useState } from "react";
import { RiLoader2Fill } from "react-icons/ri";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Register.module.scss";
import { register as registerApi } from "~/Services/AuthService"; // ✅ bạn cần có hàm register
import { useAuth } from "~/context/AuthContext";

const cx = classNames.bind(styles);

function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const { initializeAuth } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [errUsername, setErrUsername] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errPassword, setErrPassword] = useState("");
    const [errConfirm, setErrConfirm] = useState("");
    const [apiError, setApiError] = useState("");

    const [loading, setLoading] = useState(false);

    const isDisabled = useMemo(() => {
        return (
            loading ||
            username.trim().length < 3 ||
            email.trim().length < 6 ||
            password.length < 8 ||
            confirmPassword.length < 8 ||
            password !== confirmPassword
        );
    }, [loading, username, email, password, confirmPassword]);

    // ===== Realtime validation =====
    useEffect(() => {
        const v = username.trim();
        if (!v) return setErrUsername("");
        if (v.length < 3) return setErrUsername("Username ít nhất 3 ký tự");
        setErrUsername("");
    }, [username]);

    useEffect(() => {
        const v = email.trim();
        if (!v) return setErrEmail("");
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        if (!ok) return setErrEmail("Email không hợp lệ");
        setErrEmail("");
    }, [email]);

    useEffect(() => {
        if (!password) return setErrPassword("");
        if (password.length < 8) return setErrPassword("Mật khẩu ít nhất 8 ký tự");
        setErrPassword("");
    }, [password]);

    useEffect(() => {
        if (!confirmPassword) return setErrConfirm("");
        if (confirmPassword.length < 8) return setErrConfirm("Mật khẩu ít nhất 8 ký tự");
        if (confirmPassword !== password) return setErrConfirm("Mật khẩu nhập lại không khớp");
        setErrConfirm("");
    }, [confirmPassword, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDisabled) return;

        setLoading(true);
        setApiError("");

        try {
            // ✅ gọi API register
            const result = await registerApi({
                username: username.trim(),
                email: email.trim(),
                password,
                confirmPassword, // nếu backend không cần thì xoá
            });

            // ✅ tuỳ backend trả về kiểu gì: meta.newAccessToken / accessToken / token
            const token =
                result?.meta?.newAccessToken || result?.accessToken || result?.token;

            if (token) {
                localStorage.setItem("accessToken", token);
                await initializeAuth();

                const from = location.state?.from?.pathname || "/";
                navigate(from, { replace: true });
                return;
            }

            // ✅ nếu backend không trả token -> hiển thị lỗi chung
            setApiError(result?.message || "Đăng ký thất bại, vui lòng thử lại");
        } catch (err) {
            console.error("Register error:", err);
            setApiError(err?.message || "Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cx("form")}>
            <div className={cx("form-group")}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    placeholder="Nhập username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    disabled={loading}
                />
                {errUsername && <span className={cx("error")}>{errUsername}</span>}
            </div>

            <div className={cx("form-group")}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={loading}
                />
                {errEmail && <span className={cx("error")}>{errEmail}</span>}
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
                        autoComplete="new-password"
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
                {errPassword && <span className={cx("error")}>{errPassword}</span>}
            </div>

            <div className={cx("form-group", "password-group")}>
                <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                <div className={cx("password-wrapper")}>
                    <input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className={cx("btn-eye")}
                        onClick={() => setShowConfirm((v) => !v)}
                        aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        disabled={loading}
                    >
                        {showConfirm ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                </div>
                {errConfirm && <span className={cx("error")}>{errConfirm}</span>}
            </div>

            {apiError && <div className={cx("apiError")}>⚠️ {apiError}</div>}

            <button type="submit" className={cx("submit")} disabled={isDisabled}>
                {loading ? (
                    <div className={cx("loading")}>
                        <RiLoader2Fill className={cx("spin")} />
                        <span className={cx("buttonText")}>Đang đăng ký...</span>
                    </div>
                ) : (
                    <span className={cx("buttonText")}>Đăng ký</span>
                )}
            </button>
        </form>
    );
}
export default Register;