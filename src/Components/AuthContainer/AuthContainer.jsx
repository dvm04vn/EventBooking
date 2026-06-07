import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import MenuOther from './components/MenuOther';
import styles from './AuthContainer.module.scss';

const cx = classNames.bind(styles);

function AuthContainer({
    id,
    title,
    desc,
    textMenuAuth,
    footerText,
    footerLinkText,
    footerLinkTo,
    children,
}) {
    return (
        <div className={cx('wrapper')} id={id}>
            <div className={cx('brand')}>
                <Link to="/" className={cx('brandLink')}>
                    Event<span>Booking</span>
                </Link>
            </div>

            <div className={cx('card')}>
                <div className={cx('cardHeader')}>
                    <h1 className={cx('cardTitle')}>{title}</h1>
                    <p className={cx('cardDesc')}>{desc}</p>
                </div>

                <div className={cx('cardBody')}>{children}</div>

                <MenuOther textMenuAuth={textMenuAuth} />

                <div className={cx('cardFooter')}>
                    <span>{footerText}</span>
                    <Link to={footerLinkTo}>{footerLinkText}</Link>
                </div>
            </div>
        </div>
    );
}

export default AuthContainer;