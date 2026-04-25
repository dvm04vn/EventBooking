import classNames from 'classnames/bind';
import styles from './Avatar.module.scss';

const cx = classNames.bind(styles);

function Avatar({
  src,
  alt = 'avatar',
  size = 'md',   // xs | sm | md | lg | xl
  shape = 'circle', // circle | square
  fallback,      // text fallback khi không có ảnh
  status,        // online | offline | away
  className,
}) {
  const getInitials = (name = '') =>
    name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

  return (
    <div
      className={cx('avatar', `size-${size}`, `shape-${shape}`, className)}
    >
      {src ? (
        <img src={src} alt={alt} className={cx('img')} />
      ) : (
        <span className={cx('fallback')}>
          {fallback ? getInitials(fallback) : '?'}
        </span>
      )}

      {status && (
        <span className={cx('status', `status-${status}`)} />
      )}
    </div>
  );
}

export default Avatar;