import AuthContainer from '~/Components/AuthContainer';

import RegisterForm from './components/RegisterForm';

function Register() {
    return (
        <AuthContainer
            id="register"
            title="Tạo tài khoản mới"
            desc="Tham gia EventBooking để khám phá sự kiện, đặt vé trực tuyến và theo dõi lịch sử đặt vé của bạn."
            textMenuAuth="Hoặc đăng ký với"
            footerText="Đã có tài khoản?"
            footerLinkText="Đăng nhập"
            footerLinkTo="/login"
        >
            <RegisterForm />
        </AuthContainer>
    );
}

export default Register;