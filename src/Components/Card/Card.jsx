import React, { forwardRef, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./Card.module.scss";

const cx = classNames.bind(styles);

const Card = forwardRef(
  (
    {
      as: Component = "div",
      component,
      children,
      variant = "default",
      clickable = false,
      interactive,
      disabled = false,
      className,
      onClick,
      onKeyDown,
      tabIndex,
      href,
      target,
      rel,
      ...rest
    },
    ref
  ) => {
    const As = component || Component;

    const inferred = !!onClick || (!!href && As === "a");
    const isInteractive = (interactive ?? inferred) && !disabled;

    const handleClick = useCallback(
      (e) => {
        if (disabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        onClick?.(e);
      },
      [disabled, onClick]
    );

    const handleKeyDown = useCallback(
      (e) => {
        onKeyDown?.(e);
        if (!isInteractive) return;
        if (As === "a" || As === "button") return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(e);
        }
      },
      [As, isInteractive, handleClick, onKeyDown]
    );

    const classes = cx(
      "card",
      `card--${variant}`,
      {
        "card--clickable": clickable,
        "card--interactive": isInteractive,
        "card--disabled": disabled,
      },
      className
    );

    const anchorProps =
      As === "a"
        ? {
          href: disabled ? undefined : href,
          target,
          rel: target === "_blank"
            ? [rel, "noopener", "noreferrer"].filter(Boolean).join(" ")
            : rel,
        }
        : {};

    const a11yProps =
      isInteractive && As !== "a" && As !== "button"
        ? { role: "button", tabIndex: tabIndex ?? 0 }
        : { tabIndex };

    return (
      <As
        ref={ref}
        className={classes}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-disabled={disabled || undefined}
        {...anchorProps}
        {...a11yProps}
        {...rest}
      >
        {children}
      </As>
    );
  }
);

export default Card;