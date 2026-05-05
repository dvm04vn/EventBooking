import classNames from "classnames/bind";
import styles from "./Events.module.scss";
import { useEffect, useMemo, useState } from "react";
// import { getAllEvents } from "~/Services/events.service";
import EventListCard from "~/Components/EventListCard";
import images from "~/assets";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const INITIAL_VISIBLE_COUNT = 8;
const LOAD_MORE_COUNT = 4;

export const ALL_EVENTS = {
  success: true,
  message: "Đã lấy dữ liệu thành công",
  data: [
    {
      id: 1,
      title: "Đêm nhạc Trịnh Công Sơn",
      pageTitle: "Đêm nhạc Trịnh Công Sơn",
      dateLabel: "Thứ Bảy, 28/10/2024",
      dateText: "28/10/2024 - 19:00",
      dateSubText: "Thứ Bảy, bắt đầu lúc 19:00",
      venue: "Nhà hát Lớn, Hà Nội",
      locationText: "Nhà hát Lớn, Hà Nội",
      locationSubText: "Số 1 Tràng Tiền, Hoàn Kiếm, Hà Nội",
      priceText: "Từ 500.000đ",
      image: images.event,
      banner: images.eventDetail,
      popularity: 98,
      date: "2024-10-28",
      minPrice: 500000,
      attendeesText: "Hơn 2,345 người đã tham gia",
      description: [
        "Một đêm nhạc sâu lắng dành cho những người yêu nhạc Trịnh Công Sơn.",
        "Không gian biểu diễn được dàn dựng chỉn chu cùng các ca sĩ khách mời nổi bật.",
      ],
      speakers: [
        {
          id: 1,
          name: "Ca sĩ khách mời",
          role: "Nghệ sĩ biểu diễn",
          avatar: images.avatar || images.event,
        },
      ],
      mapImage: images.map || images.event,
    },
    {
      id: 2,
      title: "Hội thảo Marketing 2024",
      dateLabel: "Thứ Sáu, 15/11/2024",
      venue: "Trung tâm White Palace, TP.HCM",
      priceText: "1.200.000đ",
      image: images.event,
      popularity: 86,
      date: "2024-11-15",
      minPrice: 1200000,
    },
    {
      id: 3,
      title: "Giải chạy Marathon Quốc Tế",
      dateLabel: "Chủ Nhật, 01/12/2024",
      venue: "Cung đường ven biển Đà Nẵng",
      priceText: "Miễn phí tham gia",
      image: images.event,
      popularity: 92,
      date: "2024-12-01",
      minPrice: 0,
    },
    {
      id: 4,
      title: "Lễ hội phim ngoài trời",
      dateLabel: "Thứ Năm, 21/12/2024",
      venue: "Công viên Lê Thị Riêng, TP.HCM",
      priceText: "Miễn phí vào cửa",
      image: images.event,
      popularity: 77,
      date: "2024-12-21",
      minPrice: 0,
    },
    {
      id: 5,
      title: "Ravolution Music Festival",
      dateLabel: "Thứ Bảy, 14/12/2024",
      venue: "SECC, quận 7, TP.HCM",
      priceText: "Từ 800.000đ",
      image: images.event,
      popularity: 99,
      date: "2024-12-14",
      minPrice: 800000,
    },
    {
      id: 6,
      title: "Triển lãm Công nghệ AI",
      dateLabel: "Thứ Năm, 07/11/2024",
      venue: "Trung tâm Triển lãm I.C.E, Hà Nội",
      priceText: "Vé mời",
      image: images.event,
      popularity: 74,
      date: "2024-11-07",
      minPrice: 0,
    },
    {
      id: 7,
      title: 'Live show ban nhạc "Cá Hồi Hoang"',
      dateLabel: "Thứ Bảy, 16/11/2024",
      venue: "Nhà thi đấu Quân khu 7, TP.HCM",
      priceText: "Từ 450.000đ",
      image: images.event,
      popularity: 88,
      date: "2024-11-16",
      minPrice: 450000,
    },
    {
      id: 8,
      title: "Lễ hội ẩm thực đường phố",
      dateLabel: "Cuối tuần, 09-10/11/2024",
      venue: "Sân vận động Hoa Lư, TP.HCM",
      priceText: "Vào cửa tự do",
      image: images.event,
      popularity: 80,
      date: "2024-11-09",
      minPrice: 0,
    },
  ],
};

function Events() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // Khi có API thật thì mở dòng này:
        // const result = await getAllEvents();

        const result = ALL_EVENTS;

        if (result?.success) {
          setEvents(result.data || []);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const visibleEvents = useMemo(() => {
    return events.slice(0, visibleCount);
  }, [events, visibleCount]);

  const hasEvents = events.length > 0;
  const hasMoreEvents = visibleCount < events.length;

  const handleViewDetail = (event) => {
    if (!event?.id) return;

    navigate(`/events/${event.id}`);
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => {
      return Math.min(prevCount + LOAD_MORE_COUNT, events.length);
    });
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("header")}>
          <h1 className={cx("title")}>Khám phá sự kiện</h1>
          <p className={cx("description")}>
            Tìm kiếm và đặt vé cho hàng ngàn sự kiện hấp dẫn trên toàn quốc
          </p>
        </div>

        {loading && (
          <div className={cx("status")}>
            <p>Đang tải sự kiện...</p>
          </div>
        )}

        {!loading && !hasEvents && (
          <div className={cx("status")}>
            <p>Hiện chưa có sự kiện nào.</p>
          </div>
        )}

        {!loading && hasEvents && (
          <>
            <div className={cx("event-list")}>
              {visibleEvents.map((event) => (
                <EventListCard
                  key={event.id}
                  event={event}
                  onCardClick={() => handleViewDetail(event)}
                />
              ))}
            </div>

            {hasMoreEvents && (
              <div className={cx("footer")}>
                <button
                  type="button"
                  className={cx("load-more-btn")}
                  onClick={handleLoadMore}
                >
                  Xem thêm sự kiện
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Events;