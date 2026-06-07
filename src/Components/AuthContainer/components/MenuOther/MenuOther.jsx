import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';
import classNames from 'classnames/bind';

import styles from './MenuOther.module.scss';

const cx = classNames.bind(styles);

function MenuOther({
    textMenuAuth = 'Hoặc tiếp tục với',
    onGoogleClick,
    onFacebookClick,
}) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('divider')}>
                <span>{textMenuAuth}</span>
            </div>

            <div className={cx('social-list')}>
                <button
                    type="button"
                    className={cx('social-button')}
                    onClick={onGoogleClick}
                >
                    <FcGoogle className={cx('google-icon')} />
                    <span>Google</span>
                </button>

                <button
                    type="button"
                    className={cx('social-button')}
                    onClick={onFacebookClick}
                >
                    <FaFacebookF className={cx('facebook-icon')} />
                    <span>Facebook</span>
                </button>
            </div>
        </div>
    );
}

export default MenuOther;