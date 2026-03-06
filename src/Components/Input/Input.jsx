import React, { forwardRef } from "react";
import classNames from "classnames/bind";
import styles from "./Input.module.scss";

const cx = classNames.bind(styles);

const Input = forwardRef(
  (
    {
      id,
      name,
      label,
      helperText,
      error = false,
      errorMessage,
      fullWidth = false,
      className,          // áp vào chính <input>
      wrapperClassName,   // áp vào wrapper (optional)
      type = "text",
      leftIcon,
      rightIcon,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref
  ) => {
    const inputId = id || name || undefined;
    const helperId = helperText ? `${inputId || "input"}-helper` : undefined;
    const errorId =
      error && errorMessage ? `${inputId || "input"}-error` : undefined;

    // Merge aria-describedby (từ bên ngoài + helper + error)
    const describedBy = [
      ariaDescribedBy,
      error ? errorId : null,
      !error && helperText ? helperId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div
        className={cx(
          "wrapper",
          wrapperClassName,
          {
            fullWidth,
          }
        )}
      >
        {label && inputId && (
          <label htmlFor={inputId} className={cx("label")}>
            {label}
          </label>
        )}

        <div
          className={cx("inputContainer", {
            hasLeftIcon: !!leftIcon,
            hasRightIcon: !!rightIcon,
            error,
          })}
        >
          {leftIcon && (
            <span className={cx("icon", "leftIcon")} aria-hidden="true">
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            name={name}
            ref={ref}
            type={type}
            className={cx("input", className, { error })}
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            {...rest}
          />

          {rightIcon && (
            <span className={cx("icon", "rightIcon")} aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        {helperText && !error && (
          <p id={helperId} className={cx("helperText")}>
            {helperText}
          </p>
        )}

        {error && errorMessage && (
          <p id={errorId} className={cx("errorText")}>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);


export default Input;
