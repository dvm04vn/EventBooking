import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Button.module.scss";

const cx = classNames.bind(styles);

const Button = forwardRef(
  (
    {
      to,
      href,
      primary = false,
      outline = false,
      text = false,
      rounded = false,
      disabled = false,
      small = false,
      large = false,
      leftIcon = null,
      rightIcon = null,
      children,
      className,
      type = "button",
      onClick,
      ...passProps
    },
    ref
  ) => {
    let Component = "button";

    /** @type {Record<string, unknown>} */
    const props = {
      ...passProps,
      onClick,
    };

    // Quyết định loại component: Link / a / button
    if (to) {
      Component = Link;
      props.to = to;
    } else if (href) {
      Component = "a";
      props.href = href;
    }

    // Xử lý disabled cho a/Link và button
    if (disabled) {
      props["aria-disabled"] = true;

      // Với button: dùng thuộc tính disabled chuẩn
      if (Component === "button") {
        props.disabled = true;
      } else {
        // Với Link / a: chặn click + tab
        props.onClick = (event) => {
          event.preventDefault();
          event.stopPropagation();
        };
        props.tabIndex = -1;
      }
    }

    // Nếu là <button> mà không set type → mặc định "button" để tránh submit form ngoài ý muốn
    if (Component === "button") {
      props.type = type;
    }

    const classes = cx(
      "wrapper",
      {
        [className]: className,
        primary,
        outline,
        text,
        rounded,
        small,
        large,
        disabled,
      }
    );

    return (
      <Component ref={ref} className={classes} {...props}>
        {leftIcon && (
          <span className={cx("icon", "leftIcon")}>
            {leftIcon}
          </span>
        )}

        <span className={cx("title")}>{children}</span>

        {rightIcon && (
          <span className={cx("icon", "rightIcon")}>
            {rightIcon}
          </span>
        )}
      </Component>
    );
  }
);


export default Button;
