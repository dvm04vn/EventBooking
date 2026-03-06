import React, { useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./Breadcrumb.module.scss";

const cx = classNames.bind(styles);


function Breadcrumb({
    items = [],
    separator = "/",
    ariaLabel = "Breadcrumb",
    className,
    allowActiveLink = false,
    onItemClick,
    renderItem,
}) {
    const navigate = useNavigate();

    const { list, activeIndex } = useMemo(() => {
        const normalized = Array.isArray(items) ? items.filter(Boolean) : [];

        // ưu tiên isActive explicit
        const explicitActive = normalized.findIndex((it) => it?.isActive);
        const idx =
            explicitActive >= 0 ? explicitActive : Math.max(0, normalized.length - 1);

        return { list: normalized, activeIndex: idx };
    }, [items]);

    const handleItemClick = useCallback(
        (item, idx, e) => {
            if (item?.disabled) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            // hook analytics / custom behavior
            if (typeof onItemClick === "function") {
                const ret = onItemClick(item, idx, e);
                if (ret === false) {
                    e.preventDefault();
                    return;
                }
            }

            // Nếu bạn muốn hỗ trợ navigate bằng JS (không dùng Link)
            // trong trường hợp renderItem custom, có thể gọi ở đây
            // (mặc định Link/href sẽ tự điều hướng)
            if (item?.to && e.defaultPrevented) return;
            if (item?.to && e.currentTarget?.dataset?.nav === "1") {
                e.preventDefault();
                navigate(item.to);
            }
        },
        [onItemClick, navigate]
    );

    if (!list.length) return null;

    return (
        <nav className={cx("wrapper", className)} aria-label={ariaLabel}>
            <ol className={cx("list")}>
                {list.map((item, idx) => {
                    const isActive = idx === activeIndex;
                    const isDisabled = !!item.disabled;

                    const canNavigate = !!(item.to || item.href);
                    const shouldLink =
                        canNavigate && (!isActive || allowActiveLink) && !isDisabled;

                    const ctx = {
                        index: idx,
                        isActive,
                        isDisabled,
                        isLast: idx === list.length - 1,
                    };

                    let content = null;

                    // Custom render hook (optional)
                    if (typeof renderItem === "function") {
                        content = renderItem(item, ctx);
                    } else if (shouldLink && item.to) {
                        content = (
                            <Link
                                className={cx("link", isActive && "activeLink")}
                                to={item.to}
                                aria-current={isActive ? "page" : undefined}
                                onClick={(e) => handleItemClick(item, idx, e)}
                            >
                                {item.icon ? <span className={cx("icon")}>{item.icon}</span> : null}
                                <span className={cx("label")}>{item.label}</span>
                            </Link>
                        );
                    } else if (shouldLink && item.href) {
                        content = (
                            <a
                                className={cx("link", isActive && "activeLink")}
                                href={item.href}
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-current={isActive ? "page" : undefined}
                                onClick={(e) => handleItemClick(item, idx, e)}
                            >
                                {item.icon ? <span className={cx("icon")}>{item.icon}</span> : null}
                                <span className={cx("label")}>{item.label}</span>
                            </a>
                        );
                    } else {
                        content = (
                            <span
                                className={cx("text", isActive && "active", isDisabled && "disabled")}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {item.icon ? <span className={cx("icon")}>{item.icon}</span> : null}
                                <span className={cx("label")}>{item.label}</span>
                            </span>
                        );
                    }

                    return (
                        <li
                            key={item.id ?? `${item.label}-${idx}`}
                            className={cx("item")}
                            aria-disabled={isDisabled || undefined}
                        >
                            {content}

                            {idx < list.length - 1 ? (
                                <span className={cx("sep")} aria-hidden="true">
                                    {separator}
                                </span>
                            ) : null}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default Breadcrumb;
