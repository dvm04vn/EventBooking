import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.scss";

import BannerHome from "./components/BannerHome";
import EventCard from "~/Components/EventCard";
import images from "~/assets";

const cx = classNames.bind(styles);

const FEATURED_EVENTS = [
  {
    id: 1,
    title: "Đại nhạc hội Mùa hè 2024",
    location: "Sân vận động Quốc gia - Hà Nội",
    dateTag: "25 Thg 8",
    image: images.homeEvent1 || images.event,
  },
  {
    id: 2,
    title: "Triển lãm nghệ thuật Đương đại",
    location: "Trung tâm Triển lãm Sài Gòn",
    dateTag: "10 Thg 9",
    image: images.homeEvent2 || images.event,
  },
  {
    id: 3,
    title: "Vở kịch 'Hoàng Hôn'",
    location: "Nhà hát Lớn Thành phố",
    dateTag: "20 Thg 9",
    image: images.homeEvent3 || images.event,
  },
  {
    id: 4,
    title: "Lễ hội ẩm thực Quốc tế",
    location: "Công viên Trung tâm",
    dateTag: "05 Thg 10",
    image: images.homeEvent4 || images.event,
  },
];

function Home() {
  const navigate = useNavigate();

  const handleViewDetail = (event) => {
    if (!event?.id) return;
    navigate(`/events/${event.id}`);
  };

  return (
    <div className={cx("wrapper")}>
      <BannerHome />

      <section className={cx("featured-section")}>
        <div className={cx("container")}>
          <h2 className={cx("section-title")}>Sự Kiện Nổi Bật</h2>

          <div className={cx("event-list")}>
            {FEATURED_EVENTS.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onCardClick={handleViewDetail}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;