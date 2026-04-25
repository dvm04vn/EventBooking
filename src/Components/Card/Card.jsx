import classNames from 'classnames/bind';
import styles from './Card.module.scss';

const cx = classNames.bind(styles);

function Card({
  children,
  className,
  hoverable = false,
  bordered = false,
  flat = false,
  clickable = false,
  padding = 'md',
  rounded = 'lg',
  shadow = 'sm',
  onClick,
  ...passProps
}) {
  return (
    <div
      className={cx(
        'card',
        `padding-${padding}`,
        `rounded-${rounded}`,
        `shadow-${shadow}`,
        {
          hoverable,
          bordered,
          flat,
          clickable: clickable || !!onClick,
        },
        className,
      )}
      onClick={onClick}
      {...passProps}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({
  children,
  className,
  hasBorder = false,
  align = 'between',
  ...passProps
}) {
  return (
    <div
      className={cx(
        'header',
        `header-align-${align}`,
        { 'header-border': hasBorder },
        className,
      )}
      {...passProps}
    >
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children, className, ...passProps }) {
  return (
    <h3 className={cx('title', className)} {...passProps}>
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({
  children,
  className,
  ...passProps
}) {
  return (
    <p className={cx('description', className)} {...passProps}>
      {children}
    </p>
  );
};

Card.Action = function CardAction({ children, className, ...passProps }) {
  return (
    <div className={cx('action', className)} {...passProps}>
      {children}
    </div>
  );
};

Card.Content = function CardContent({
  children,
  className,
  flush = false,
  ...passProps
}) {
  return (
    <div
      className={cx('content', { flush }, className)}
      {...passProps}
    >
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({
  children,
  className,
  hasBorder = false,
  align = 'end',
  ...passProps
}) {
  return (
    <div
      className={cx(
        'footer',
        `footer-align-${align}`,
        { 'footer-border': hasBorder },
        className,
      )}
      {...passProps}
    >
      {children}
    </div>
  );
};

export default Card;