import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLoader2Fill } from 'react-icons/ri';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';

import styles from './RegisterForm.module.scss';
import { register } from '~/Services/auth.service';

const cx = classNames.bind(styles);

function RegisterForm() {
    const navigate = useNavigate();

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [fullnameError, setFullnameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [apiError, setApiError] = useState('');

    const [loading, setLoading] = useState(false);

    const isDisabled = useMemo(() => {
        return (
            loading ||
            !fullname.trim() ||
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim() ||
            Boolean(fullnameError) ||
            Boolean(emailError) ||
            Boolean(passwordError) ||
            Boolean(confirmPasswordError)
        );
    }, [
        loading,
        fullname,
        email,
        password,
        confirmPassword,
        fullnameError,
        emailError,
        passwordError,
        confirmPasswordError,
    ]);

    useEffect(() => {
        const value = fullname.trim();

        if (!value) {
            setFullnameError('');
            return;
        }

        if (value.length < 2) {
            setFullnameError('Họ và tên phải có ít nhất 2 ký tự');
            return;
        }

        setFullnameError('');
    }, [fullname]);

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

    useEffect(() => {
        if (!confirmPassword) {
            setConfirmPasswordError('');
            return;
        }

        if (confirmPassword.length < 6) {
            setConfirmPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (confirmPassword !== password) {
            setConfirmPasswordError('Mật khẩu nhập lại không khớp');
            return;
        }

        setConfirmPasswordError('');
    }, [confirmPassword, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isDisabled) return;

        try {
            setLoading(true);
            setApiError('');

            const result = await register(
                fullname.trim(),
                email.trim(),
                password,
            );

            const accessToken =
                result?.accessToken ||
                result?.token ||
                result?.meta?.token ||
                result?.meta?.newAccessToken;

            const user =
                result?.user ||
                result?.data?.user ||
                result?.data?.[0]?.user ||
                null;

            if (accessToken && user) {
                localStorage.setItem('accessToken', accessToken);
                setUser(user);

                toast.success('Đăng ký tài khoản thành công');
                navigate('/');
                return;
            }

            toast.success('Đăng ký tài khoản thành công');
            navigate('/login');
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Đăng ký thất bại, vui lòng thử lại';

            setApiError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cx('form')}>
            <div className={cx('form-group')}>
                <label htmlFor="fullname">Họ và tên</label>

                <input
                    id="fullname"
                    type="text"
                    placeholder="Nhập họ và tên"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    autoComplete="name"
                    disabled={loading}
                />

                {fullnameError && (
                    <span className={cx('error')}>{fullnameError}</span>
                )}
            </div>

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
                        autoComplete="new-password"
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

            <div className={cx('form-group')}>
                <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>

                <div className={cx('password-wrapper')}>
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        disabled={loading}
                    />

                    <button
                        type="button"
                        className={cx('btn-eye')}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={
                            showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                        }
                        disabled={loading}
                    >
                        {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                </div>

                {confirmPasswordError && (
                    <span className={cx('error')}>{confirmPasswordError}</span>
                )}
            </div>

            {apiError && <div className={cx('api-error')}>{apiError}</div>}

            <button type="submit" className={cx('submit')} disabled={isDisabled}>
                {loading ? (
                    <span className={cx('loading')}>
                        <RiLoader2Fill className={cx('spin')} />
                        Đang đăng ký...
                    </span>
                ) : (
                    'Đăng ký'
                )}
            </button>
        </form>
    );
}

export default RegisterForm;