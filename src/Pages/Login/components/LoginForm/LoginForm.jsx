import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiLoader2Fill } from 'react-icons/ri';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';

import styles from './LoginForm.module.scss';
import { login } from '~/Services/auth.service';

const cx = classNames.bind(styles);

function LoginForm() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const isDisabled =
        loading ||
        !email.trim() ||
        !password.trim() ||
        Boolean(emailError) ||
        Boolean(passwordError);

    useEffect(() => {
        const value = email.trim();

        if (!value) {
            setEmailError('');
            return;
        }

        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        if (!isValidEmail) {
            setEmailError('Email không hợp lệ');
            return;
        }

        setEmailError('');
    }, [email]);

    useEffect(() => {
        if (!password) {
            setPasswordError('');
            return;
        }

        if (password.length < 6) {
            setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setPasswordError('');
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isDisabled) return;

        try {
            setLoading(true);
            setApiError('');
            setEmailError('');
            setPasswordError('');

            const result = await login(email.trim(), password);

            const accessToken =
                result?.accessToken ||
                result?.token ||
                result?.meta?.token ||
                result?.meta?.newAccessToken;

            const user =
                result?.user ||
                result?.data?.user ||
                result?.data?.[0]?.user ||
                result?.data?.[0];

            if (!accessToken || !user) {
                setApiError('Đăng nhập thất bại, vui lòng thử lại');
                return;
            }

            localStorage.setItem('accessToken', accessToken);
            setUser(user);

            toast.success('Đăng nhập thành công');

            const redirectPath = location.state?.from?.pathname || '/';
            navigate(redirectPath, { replace: true });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Đăng nhập thất bại, vui lòng thử lại';

            setApiError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cx('form')}>
            <div className={cx('form-group')}>
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

                {emailError && <span className={cx('error')}>{emailError}</span>}
            </div>

            <div className={cx('form-group')}>
                <label htmlFor="password">Mật khẩu</label>

                <div className={cx('password-wrapper')}>
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        disabled={loading}
                    />

                    <button
                        type="button"
                        className={cx('btn-eye')}
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        disabled={loading}
                    >
                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                </div>

                {passwordError && (
                    <span className={cx('error')}>{passwordError}</span>
                )}
            </div>

            {apiError && <div className={cx('api-error')}>{apiError}</div>}

            <button type="submit" className={cx('submit')} disabled={isDisabled}>
                {loading ? (
                    <span className={cx('loading')}>
                        <RiLoader2Fill className={cx('spin')} />
                        Đang đăng nhập...
                    </span>
                ) : (
                    'Đăng nhập'
                )}
            </button>
        </form>
    );
}

export default LoginForm;