import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./Home.module.scss";
import { images } from "~/assets";

import Button from "~/Components/Button";
import FeaturedEvents from "./components/FeaturedEvents/FeaturedEvents";

const cx = classNames.bind(styles);

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Đại nhạc hội Mùa hè 2024",
    date: "25 Thg 8",
    dateLabel: "25 Tháng 8, 2024 • 19:00",
    venue: "Sân vận động Quốc gia",
    location: "Hà Nội",
    priceFrom: 500000,
    image: images.event,
  },
  {
    id: 2,
    title: "Triển lãm nghệ thuật Đương đại",
    date: "10 Thg 9",
    dateLabel: "10 Tháng 9, 2024 • 09:00",
    venue: "Trung tâm Triển lãm Sài Gòn",
    location: "TP. Hồ Chí Minh",
    priceFrom: 150000,
    image: images.event,
  },
  {
    id: 3,
    title: 'Vở kịch "Hoàng Hôn"',
    date: "20 Thg 9",
    dateLabel: "20 Tháng 9, 2024 • 19:30",
    venue: "Nhà hát Lớn Thành phố",
    location: "TP. Hồ Chí Minh",
    priceFrom: 300000,
    image: images.event,
  },
  {
    id: 4,
    title: "Lễ hội ẩm thực Quốc tế",
    date: "05 Thg 10",
    dateLabel: "05 Tháng 10, 2024 • 10:00",
    venue: "Công viên Trung tâm",
    location: "Đà Nẵng",
    priceFrom: 100000,
    image: images.event,
  },
];

function Home() {
  const navigate = useNavigate();

  // Mock data (sau này thay bằng API)
  const [events] = useState(() => MOCK_EVENTS);

  const bannerImage = useMemo(
    () => images.backgroundImage ?? images.event,
    []
  );

  const onViewEventsClick = useCallback(() => {
    navigate("/events");
  }, [navigate]);

  const onBookClick = useCallback(
    (eventId) => {
      navigate(`/events/${encodeURIComponent(eventId)}`);
    },
    [navigate]
  );

  return (
    <div className={cx("wrapper")}>
      <section className={cx("banner")} aria-labelledby="home-banner-title">
        <div
          className={cx("bannerBg")}
          style={{ backgroundImage: `url(${bannerImage})` }}
          aria-hidden="true"
        />
        <div className={cx("bannerOverlay")} aria-hidden="true" />

        <div className={cx("bannerInner")}>
          <div className={cx("bannerContent")}>
            <h1 id="home-banner-title" className={cx("bannerTitle")}>
              Khám Phá Những Sự Kiện Đỉnh Cao
            </h1>

            <p className={cx("bannerSubtitle")}>
              Tìm và đặt vé cho hàng ngàn concert, lễ hội, sự kiện văn hóa độc đáo.
            </p>

            <div className={cx("bannerActions")}>
              <Button
                className={cx("primaryCtaButton")}
                onClick={onViewEventsClick}
                aria-label="Xem danh sách sự kiện"
              >
                Xem Sự Kiện
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className={cx("featuredBlock")} aria-label="Sự kiện nổi bật">
        <FeaturedEvents events={events} onBook={onBookClick} />
      </section>
    </div>
  );
}

export default Home;
