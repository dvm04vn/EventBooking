import React, { useMemo, useCallback } from "react";
import classNames from "classnames/bind";
import Button from "~/Components/Button";
import styles from "./EventCard.module.scss";

const cx = classNames.bind(styles);

const formatVND = (value) => {
    if (typeof value !== "number") return "";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value);
};

const DateBadge = ({ label }) => {
    if (!label) return null;
    return <div className={cx("date-badge")}>{label}</div>;
};

const EventCard = ({ event, index = 0, onBook }) => {
    const delayStyle = useMemo(
        () => ({ animationDelay: `${index * 0.1}s` }),
        [index]
    );

    const handleBooking = useCallback(
        (e) => {
            e?.stopPropagation(); // nếu sau này bạn cho click cả card
            onBook?.(event?.id);
        },
        [onBook, event?.id]
    );

    const priceText = useMemo(() => {
        if (typeof event?.priceFrom !== "number") return "";
        return `Từ ${formatVND(event.priceFrom)}`;
    }, [event?.priceFrom]);

    return (
        <article
            className={cx("event-card")}
            style={delayStyle}
            aria-label={event?.title}
        >
            {/* Image Section */}
            <div className={cx("image-wrapper")}>
                <img
                    src={event?.image}
                    alt={event?.title || "Event image"}
                    className={cx("image")}
                    loading="lazy"
                />

                {/* Badge ngày (lấy đúng field bạn đang có: event.date) */}
                <DateBadge label={event?.date} />

                <div className={cx("overlay")} aria-hidden="true" />
            </div>

            {/* Content Section */}
            <div className={cx("content")}>
                <h3 className={cx("title")}>{event?.title}</h3>

                {/* Đồng bộ: bạn có location/venue/dateLabel */}
                {event?.location && <p className={cx("subtitle")}>{event.location}</p>}
                {event?.venue && <p className={cx("meta")}>{event.venue}</p>}
                {event?.dateLabel && <p className={cx("meta")}>{event.dateLabel}</p>}

                {/* Giá từ */}
                {priceText && <p className={cx("price")}>{priceText}</p>}

                <Button variant="primary" fullWidth onClick={handleBooking}>
                    Đặt vé
                </Button>
            </div>
        </article>
    );
};

export default EventCard;
