import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FiBookmark,
    FiShare2,
    FiCalendar,
    FiMapPin,
    FiChevronRight,
} from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import classNames from "classnames/bind";

import styles from "./EventDetail.module.scss";
import { images } from "~/assets";

import Button from "~/Components/Button";
import Card from "~/Components/Card";
import Image from "~/Components/Image";


const cx = classNames.bind(styles);

const MOCK_EVENTS = [
    {
        id: 1,
        title: "Vibrant Beats Music Festival 2024",
        cover: images.event,
        dateLabel: "October 26, 2024 – 7:00 PM",
        dateSub: "Thứ Bảy, bắt đầu lúc 19:00",
        venue: "Grand City Convention Center",
        address: "123 Convention Way, City, State",
        attendeesText: "Hơn 2,345 người đã tham gia",
        priceText: "500.000 VND",
        description: [
            "Hãy sẵn sàng cho một đêm âm nhạc bùng nổ tại Vibrant Beats Music Festival 2024! Đây là sự kiện không thể bỏ lỡ dành cho những người yêu âm nhạc, quy tụ những nghệ sĩ hàng đầu trong nước và quốc tế.",
            "Tận hưởng không gian âm nhạc đa dạng: EDM, Pop, Rock cho đến Hiphop, cùng với hệ thống âm thanh và ánh sáng đẳng cấp thế giới. Sự kiện còn có các khu vực ẩm thực và hoạt động giải trí bên lề hấp dẫn.",
        ],
        schedule: [
            { time: "18:00", title: "Mở cổng & Check-in" },
            { time: "19:00", title: "Khai mạc" },
            { time: "19:30", title: "Main Stage – DJ Elena" },
            { time: "21:00", title: "Live Band – The Wanderers" },
            { time: "23:00", title: "Bế mạc" },
        ],
        speakers: [
            { id: "sp1", name: "DJ Elena", role: "Headliner DJ", avatar: images.event },
            { id: "sp2", name: "The Wanderers", role: "Indie Rock Band", avatar: images.event },
        ],
        mapImg: images.event,
    },
];

const TABS = [
    { key: "overview", label: "Tổng quan" },
    { key: "schedule", label: "Lịch trình" },
    { key: "speakers", label: "Diễn giả" },
    { key: "venue", label: "Địa điểm" },
    { key: "tickets", label: "Vé" },
];

function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const event = useMemo(() => {
        const found = MOCK_EVENTS.find((e) => String(e.id) === String(id));
        return found ?? MOCK_EVENTS[0] ?? null;
    }, [id]);

    const eventId = event?.id;

    const [activeTab, setActiveTab] = useState("overview");

    // Khi đổi id -> reset tab để tránh “kẹt tab”
    useEffect(() => {
        setActiveTab("overview");
    }, [id, setActiveTab]);


    useEffect(() => {
        if (!event?.title) return;
        document.title = `${event.title} — Event`;
    }, [event?.title]);

    // index tab active cho underline slider
    const activeIndex = useMemo(() => {
        const idx = TABS.findIndex((t) => t.key === activeTab);
        return idx >= 0 ? idx : 0;
    }, [activeTab]);

    const buyTicket = useCallback(() => {
        if (!eventId) return;
        navigate(`/checkout/${eventId}`);
    }, [navigate, eventId]);

    const onTabsKeyDown = useCallback(
        (e) => {
            const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
            if (!keys.includes(e.key)) return;

            e.preventDefault();

            const cur = TABS.findIndex((t) => t.key === activeTab);
            const curIdx = cur >= 0 ? cur : 0;

            let nextIdx = curIdx;
            if (e.key === "ArrowLeft") nextIdx = (curIdx - 1 + TABS.length) % TABS.length;
            if (e.key === "ArrowRight") nextIdx = (curIdx + 1) % TABS.length;
            if (e.key === "Home") nextIdx = 0;
            if (e.key === "End") nextIdx = TABS.length - 1;

            const nextKey = TABS[nextIdx]?.key;
            if (!nextKey) return;

            setActiveTab(nextKey);

            requestAnimationFrame(() => {
                document.getElementById(`tab-${nextKey}`)?.focus();
            });
        },
        [activeTab]
    );

    if (!event) {
        return (
            <div className={cx("wrapper")}>
                <div className={cx("container")}>
                    <p>Sự kiện không tồn tại.</p>
                </div>
            </div>
        );
    }

    const renderSpeakers = () => (
        <div className={cx("speakerList")}>
            {(event.speakers || []).map((sp) => (
                <Card key={sp.id} className={cx("speakerItem")} variant="default">
                    <Image
                        src={sp.avatar}
                        alt=""
                        ratio={1}
                        fit="cover"
                        className={cx("speakerAvatar")}
                        decoding="async"
                        lazy
                    />
                    <div className={cx("speakerMeta")}>
                        <div className={cx("speakerName")}>{sp.name}</div>
                        <div className={cx("speakerRole")}>{sp.role}</div>
                    </div>
                </Card>
            ))}
        </div>
    );

    return (
        <div className={cx("wrapper")}>
            <div className={cx("header")}>
                <button type="button" onClick={() => navigate(-1)} className={cx("backBtn")} aria-label="Quay lại">
                    <FaArrowLeft size={18} />
                    <span className={cx("backText")}>Quay lại</span>
                </button>
                <h1 className={cx("headerTitle")} title={event.title}>
                    {event.title}
                </h1>
                <div className={cx("actions")}>
                    <button type="button" className={cx("iconBtn")} aria-label="Lưu sự kiện">
                        <FiBookmark aria-hidden size={18} />
                    </button>
                    <button type="button" className={cx("iconBtn")} aria-label="Chia sẻ">
                        <FiShare2 aria-hidden size={18} />
                    </button>
                </div>
            </div>

            <div className={cx("container")}>
                <div className={cx("cover")}>
                    <Image
                        src={event.cover}
                        alt={`Ảnh bìa sự kiện: ${event.title}`}
                        ratio={16 / 6}
                        fit="cover"
                        className={cx("coverImg")}
                        decoding="async"
                        lazy
                    />
                    <div className={cx("coverTitle")} aria-hidden="true">
                        {event.title}
                    </div>
                </div>

                <div className={cx("infoList")}>
                    <div className={cx("infoItem")}>
                        <span className={cx("icon")} aria-hidden>
                            <FiCalendar size={18} />
                        </span>
                        <div>
                            <div className={cx("infoMain")}>{event.dateLabel}</div>
                            <div className={cx("infoSub")}>{event.dateSub}</div>
                        </div>
                        <FiChevronRight className={cx("chev")} aria-hidden size={16} />
                    </div>

                    <div className={cx("infoItem")}>
                        <span className={cx("icon")} aria-hidden>
                            <FiMapPin size={18} />
                        </span>
                        <div>
                            <div className={cx("infoMain")}>{event.venue}</div>
                            <div className={cx("infoSub")}>{event.address}</div>
                        </div>
                        <FiChevronRight className={cx("chev")} aria-hidden size={16} />
                    </div>

                    <div className={cx("infoItem")} aria-live="polite">
                        <span className={cx("avatarStack")} aria-hidden>
                            <Image src={images.event} alt="" ratio={1} fit="cover" className={cx("avatar")} />
                            <Image src={images.event} alt="" ratio={1} fit="cover" className={cx("avatar")} />
                            <Image src={images.event} alt="" ratio={1} fit="cover" className={cx("avatar")} />
                        </span>
                        <div className={cx("infoSub")}>{event.attendeesText}</div>
                    </div>
                </div>

                <div
                    className={cx("tabs")}
                    role="tablist"
                    aria-label="Thông tin sự kiện"
                    aria-orientation="horizontal"
                    style={{ "--tab-count": TABS.length, "--active-index": activeIndex }}
                    onKeyDown={onTabsKeyDown}
                >
                    {TABS.map((t) => {
                        const selected = activeTab === t.key;
                        return (
                            <button
                                key={t.key}
                                id={`tab-${t.key}`}
                                type="button"
                                className={cx("tab", selected && "tabActive")}
                                role="tab"
                                aria-selected={selected}
                                aria-controls={`panel-${t.key}`}
                                tabIndex={selected ? 0 : -1}
                                onClick={() => setActiveTab(t.key)}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                <div
                    className={cx("panel")}
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                    aria-labelledby={`tab-${activeTab}`}
                >
                    {activeTab === "overview" && (
                        <>
                            <h2 className={cx("sectionTitle")}>Về sự kiện này</h2>
                            <Card className={cx("cardSoft")}>
                                <div className={cx("paragraphs")}>
                                    {(event.description || []).map((p, i) => (
                                        <p key={i}>{p}</p>
                                    ))}
                                </div>
                            </Card>

                            <h3 className={cx("sectionTitle")}>Diễn giả & Nghệ sĩ</h3>
                            {renderSpeakers()}

                            <h3 className={cx("sectionTitle")}>Địa điểm</h3>
                            <Card className={cx("mapWrap")} variant="default">
                                <Image
                                    src={event.mapImg}
                                    alt="Bản đồ địa điểm"
                                    ratio={16 / 7}
                                    fit="cover"
                                    className={cx("mapImg")}
                                    decoding="async"
                                    lazy
                                />
                            </Card>
                        </>
                    )}

                    {activeTab === "schedule" && (
                        <Card className={cx("cardSoft")}>
                            <ul className={cx("schedule")}>
                                {(event.schedule || []).map((s) => (
                                    <li key={s.time} className={cx("scheduleItem")}>
                                        <span className={cx("scheduleTime")}>{s.time}</span>
                                        <span className={cx("scheduleTitle")}>{s.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}

                    {activeTab === "speakers" && renderSpeakers()}

                    {activeTab === "venue" && (
                        <Card className={cx("mapWrap")} variant="default">
                            <Image
                                src={event.mapImg}
                                alt="Bản đồ địa điểm"
                                ratio={16 / 7}
                                fit="cover"
                                className={cx("mapImg")}
                                decoding="async"
                                lazy
                            />
                        </Card>
                    )}

                    {activeTab === "tickets" && (
                        <Card className={cx("cardSoft")}>
                            <p>Vé tiêu chuẩn, khu vực đứng tự do. Vui lòng tiếp tục để chọn hạng vé.</p>
                        </Card>
                    )}
                </div>

                <div className={cx("ctaBar")}>
                    <div className={cx("priceLabel")}>
                        <span className={cx("priceCaption")}>Giá vé từ</span>
                        <span className={cx("priceValue")}>{event.priceText}</span>
                    </div>
                    <Button className={cx("bookBtn")} onClick={buyTicket} aria-label="Đặt vé">
                        Đặt vé
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default EventDetail;
