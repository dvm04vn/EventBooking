import React, { useMemo, useCallback } from "react";
import classNames from "classnames/bind";
import Button from "~/Components/Button";
import styles from "./EventCardList.module.scss";

const cx = classNames.bind(styles);

const EventCardList = ({ event, index = 0, onClick, onBook }) => {
    const delayStyle = useMemo(
        () => ({ animationDelay: `${index * 0.1}s` }),
        [index]
    );

    const handleCardClick = useCallback(() => {
        onClick?.(event?.id);
    }, [onClick, event?.id]);

    const handleBook = useCallback(
        (e) => {
            e?.stopPropagation();
            onBook?.(event?.id);
        },
        [onBook, event?.id]
    );

    // Badge “FREE / INVITE / PAID” dựa theo minPrice hoặc priceText
    const badge = useMemo(() => {
        if (!event) return null;
        if (event.minPrice === 0) {
            // ưu tiên text nếu có (Miễn phí / Vé mời / Vào cửa tự do...)
            return (event.priceText || "").toLowerCase().includes("vé mời")
                ? { text: "VÉ MỜI", variant: "invite" }
                : { text: "MIỄN PHÍ", variant: "free" };
        }
        return { text: "CÓ PHÍ", variant: "paid" };
    }, [event]);

    return (
        <article
            className={cx("card")}
            style={delayStyle}
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCardClick();
            }}
            aria-label={`Xem chi tiết sự kiện: ${event?.title || ""}`}
        >
            {/* Image */}
            <div className={cx("image-wrapper")}>
                <img
                    src={event?.image}
                    alt={event?.title || "Event"}
                    className={cx("image")}
                    loading="lazy"
                />
                <div className={cx("overlay")} aria-hidden="true" />

                {/* Badge */}
                {badge?.text && (
                    <div className={cx("badge", badge.variant)}>{badge.text}</div>
                )}
            </div>

            {/* Content */}
            <div className={cx("content")}>
                <h3 className={cx("title")}>{event?.title}</h3>

                <div className={cx("info")}>
                    {/* Dùng đúng field: dateLabel */}
                    {event?.dateLabel && (
                        <p className={cx("date")}>
                            <span className={cx("icon")} aria-hidden="true">📅</span>
                            {event.dateLabel}
                        </p>
                    )}

                    {/* Dùng đúng field: venue */}
                    {event?.venue && (
                        <p className={cx("venue")}>
                            <span className={cx("icon")} aria-hidden="true">📍</span>
                            {event.venue}
                        </p>
                    )}
                </div>

                {/* Dùng đúng field: priceText */}
                {event?.priceText && <p className={cx("price")}>{event.priceText}</p>}

                <div className={cx("actions")}>
                    <Button variant="primary" fullWidth onClick={handleBook}>
                        Đặt vé
                    </Button>
                </div>
            </div>
        </article>
    );
};

export default EventCardList;
