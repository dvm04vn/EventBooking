import classNames from "classnames/bind";
import styles from "./EventDetail.module.scss";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookmark,
  FiShare2,
  FiCalendar,
  FiMapPin,
  FiChevronRight,
} from "react-icons/fi";

import Image from "~/Components/Image";
import images from "~/assets";
import { getEventById } from "~/Services/events.service";

const cx = classNames.bind(styles);

const EVENT_DETAIL_MOCK = {
  id: 1,
  pageTitle: "Vibrant Beats Music Festival",
  title: "Vibrant Beats Music Festival 2024",
  banner: images.eventDetail,
  dateText: "October 26, 2024 - 7:00 PM",
  dateSubText: "Thứ Bảy, bắt đầu lúc 19:00",
  locationText: "Grand City Convention Center",
  locationSubText: "123 Convention Way, City, State",
  attendeesText: "Hơn 2,345 người đã tham gia",
  description: [
    "Hãy sẵn sàng cho một đêm âm nhạc bùng nổ tại Vibrant Beats Music Festival 2024! Đây là sự kiện không thể bỏ lỡ dành cho những người yêu âm nhạc, quy tụ những nghệ sĩ hàng đầu trong nước và quốc tế.",
    "Tận hưởng không gian âm nhạc đa dạng từ EDM, Pop, Rock cho đến Hiphop, cùng với hệ thống âm thanh và ánh sáng đẳng cấp thế giới. Sự kiện cũng có các khu vực ẩm thực và hoạt động giải trí bên lề hấp dẫn.",
  ],
  speakers: [
    {
      id: 1,
      name: "DJ Elena",
      role: "Headliner DJ",
      avatar: images.avatar || images.event,
    },
    {
      id: 2,
      name: "The Wanderers",
      role: "Indie Rock Band",
      avatar: images.avatar || images.event,
    },
  ],
  priceText: "500.000 VND",
  minPrice: 500000,
  mapImage: images.map || images.event,
};

function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [eventDetail, setEventDetail] = useState(EVENT_DETAIL_MOCK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchEventDetail = async () => {
      setLoading(true);

      try {
        const res = await getEventById(id);

        if (!isMounted) return;

        setEventDetail(res?.data || EVENT_DETAIL_MOCK);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sự kiện:", error);

        if (!isMounted) return;

        setEventDetail(EVENT_DETAIL_MOCK);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!id) {
      setEventDetail(EVENT_DETAIL_MOCK);
      setLoading(false);
      return;
    }

    fetchEventDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const tabs = useMemo(() => {
    return ["Tổng quan", "Lịch trình", "Diễn giả", "Địa điểm", "Vé"];
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBookTicket = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/login", {
        state: {
          redirectTo: `/events/${eventDetail.id}/booking`,
        },
      });
      return;
    }

    navigate(`/events/${eventDetail.id}/booking`);
  };

  if (loading) {
    return (
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <div className={cx("status")}>
            <p>Đang tải chi tiết sự kiện...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <header className={cx("topbar")}>
          <button
            type="button"
            className={cx("back-button")}
            onClick={handleGoBack}
          >
            <FiArrowLeft className={cx("back-icon")} />
            <span>Quay lại</span>
          </button>

          <h1 className={cx("page-title")}>
            {eventDetail.pageTitle || eventDetail.title}
          </h1>

          <div className={cx("top-actions")}>
            <button type="button" className={cx("icon-button")}>
              <FiBookmark />
            </button>
            <button type="button" className={cx("icon-button")}>
              <FiShare2 />
            </button>
          </div>
        </header>

        <section className={cx("hero")}>
          <div className={cx("hero-image")}>
            <Image
              src={eventDetail.banner || eventDetail.image || images.eventDetail}
              alt={eventDetail.title}
              imgClassName={cx("banner-image")}
              ratio="16 / 6"
              rounded="lg"
            />
            <div className={cx("hero-overlay")} />
            <h2 className={cx("hero-title")}>{eventDetail.title}</h2>
          </div>
        </section>

        <section className={cx("meta-list")}>
          <div className={cx("meta-card")}>
            <div className={cx("meta-icon")}>
              <FiCalendar />
            </div>
            <div className={cx("meta-content")}>
              <p className={cx("meta-title")}>{eventDetail.dateText}</p>
              <p className={cx("meta-subtitle")}>{eventDetail.dateSubText}</p>
            </div>
            <span className={cx("meta-arrow")}>
              <FiChevronRight />
            </span>
          </div>

          <div className={cx("meta-card")}>
            <div className={cx("meta-icon")}>
              <FiMapPin />
            </div>
            <div className={cx("meta-content")}>
              <p className={cx("meta-title")}>
                {eventDetail.locationText || eventDetail.venue}
              </p>
              <p className={cx("meta-subtitle")}>
                {eventDetail.locationSubText || eventDetail.address}
              </p>
            </div>
            <span className={cx("meta-arrow")}>
              <FiChevronRight />
            </span>
          </div>

          <div className={cx("attendees")}>
            <div className={cx("attendees-avatars")}>
              <div className={cx("attendee-avatar")}>
                <img src={images.avatar || images.event} alt="attendee 1" />
              </div>
              <div className={cx("attendee-avatar", "is-overlap")}>
                <img src={images.avatar || images.event} alt="attendee 2" />
              </div>
            </div>

            <p className={cx("attendees-text")}>
              {eventDetail.attendeesText || "Hơn 2,345 người đã tham gia"}
            </p>
          </div>
        </section>

        <nav className={cx("tabs")}>
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={cx("tab", { active: index === 0 })}
            >
              {tab}
            </button>
          ))}
        </nav>

        <section className={cx("section")}>
          <h3 className={cx("section-title")}>Về sự kiện này</h3>

          <div className={cx("description")}>
            {(Array.isArray(eventDetail.description)
              ? eventDetail.description
              : [eventDetail.description || ""]).map((paragraph, index) => (
                <p key={`${eventDetail.id}-${index}`} className={cx("paragraph")}>
                  {paragraph}
                </p>
              ))}
          </div>
        </section>

        <section className={cx("section")}>
          <h3 className={cx("section-title")}>Diễn giả & Nghệ sĩ</h3>

          <div className={cx("speaker-list")}>
            {(eventDetail.speakers || []).map((speaker, index) => (
              <div key={speaker.id || index} className={cx("speaker-card")}>
                <div className={cx("speaker-avatar")}>
                  <img
                    src={speaker.avatar || images.avatar || images.event}
                    alt={speaker.name}
                  />
                </div>

                <div className={cx("speaker-content")}>
                  <p className={cx("speaker-name")}>{speaker.name}</p>
                  <p className={cx("speaker-role")}>{speaker.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={cx("section")}>
          <h3 className={cx("section-title")}>Địa điểm</h3>

          <div className={cx("map-box")}>
            <img
              src={eventDetail.mapImage || images.map || images.event}
              alt="Event location map"
              className={cx("map-image")}
            />
          </div>
        </section>

        <footer className={cx("booking-bar")}>
          <div className={cx("booking-price")}>
            <p className={cx("booking-label")}>Giá vé từ</p>
            <p className={cx("booking-value")}>
              {eventDetail.priceText || "500.000 VND"}
            </p>
          </div>

          <button
            type="button"
            className={cx("booking-button")}
            onClick={handleBookTicket}
          >
            Đặt vé
          </button>
        </footer>
      </div>
    </div>
  );
}

export default EventDetail;