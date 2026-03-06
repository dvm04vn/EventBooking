import React from "react";
import classNames from "classnames/bind";
import styles from "./FeaturedEvents.module.scss";
import EventCard from "~/Components/EventCard/EventCard";

const cx = classNames.bind(styles);

const FeaturedEvents = ({ events = [], onBook }) => {
    return (
        <section id="featured-events" className={cx("featured-events")}>
            <div className={cx("container")}>
                {/* Section Header */}
                <div className={cx("header")}>
                    <h2 className={cx("title")}>Sự Kiện Nổi Bật</h2>
                </div>

                {/* Events Grid */}
                <div className={cx("grid")}>
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                index={index}
                                onBook={onBook}
                            />
                        ))
                    ) : (
                        <p className={cx("empty")}>Chưa có sự kiện nổi bật.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedEvents;
