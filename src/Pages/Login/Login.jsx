import AuthContainer from '~/Components/AuthContainer';

import LoginForm from './components/LoginForm';

function Login() {
    return (
        <AuthContainer
            id="login"
            title="Đăng nhập"
            desc="Chào mừng bạn quay lại EventBooking. Đăng nhập để tiếp tục đặt vé và quản lý sự kiện của bạn."
            textMenuAuth="Hoặc đăng nhập với"
            footerText="Chưa có tài khoản?"
            footerLinkText="Đăng ký ngay"
            footerLinkTo="/register"
        >
            <LoginForm />
        </AuthContainer>
    );
}

export default Login;