import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./Events.module.scss";
import { images } from "~/assets";

import Button from "~/Components/Button";
import SearchBar from "~/Components/SearchBar";
import EventCardList from "~/Components/EventCardList/EventCardList";

const cx = classNames.bind(styles);

const ALL_EVENTS = [
  {
    id: 1,
    title: "Đêm nhạc Trịnh Công Sơn",
    dateLabel: "Thứ Bảy, 28/10/2024",
    venue: "Nhà hát Lớn, Hà Nội",
    priceText: "Từ 500.000đ",
    image: images.event,
    popularity: 98,
    date: "2024-10-28",
    minPrice: 500000,
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
];

const PAGE_SIZE = 8;
const normalize = (v) => (v || "").toLowerCase().trim();

function Events() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Filter + Sort
  const filteredSorted = useMemo(() => {
    const q = normalize(query);

    let list = ALL_EVENTS;
    if (q) {
      list = list.filter((e) => {
        const inTitle = normalize(e.title).includes(q);
        const inVenue = normalize(e.venue).includes(q);
        return inTitle || inVenue;
      });
    }

    const clone = [...list];
    switch (sortBy) {
      case "newest":
        clone.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "priceAsc":
        clone.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case "priceDesc":
        clone.sort((a, b) => b.minPrice - a.minPrice);
        break;
      default: // popular
        clone.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    return clone;
  }, [query, sortBy]);

  // Paging
  const visibleEvents = useMemo(
    () => filteredSorted.slice(0, visible),
    [filteredSorted, visible]
  );

  const canLoadMore = visible < filteredSorted.length;

  // Handlers
  const handleSearch = useCallback((raw) => {
    setQuery((raw || "").trim());
    setVisible(PAGE_SIZE);
  }, []);

  const handleChange = useCallback((val) => {
    setQuery(val);
    setVisible(PAGE_SIZE);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
    setVisible(PAGE_SIZE);
  }, []);

  const goDetail = useCallback(
    (id) => navigate(`/events/${encodeURIComponent(id)}`),
    [navigate]
  );

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        {/* Header */}
        <section className={cx("header_events")}>
          <h1 className={cx("title")}>Khám Phá Sự Kiện</h1>
          <p className={cx("subtitle")}>
            Tìm kiếm và đặt vé cho hàng ngàn sự kiện hấp dẫn trên toàn quốc.
          </p>

          <div className={cx("toolbar")}>
            <SearchBar
              value={query}
              onChange={handleChange}
              onSearch={handleSearch}
              placeholder="Tìm kiếm tên sự kiện, nghệ sĩ, địa điểm..."
              showClearButton
              aria-label="Tìm kiếm sự kiện"
            />

            <div className={cx("sortBox")}>
              <label htmlFor="sort" className={cx("sortLabel")}>
                Sắp xếp
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={handleSortChange}
                className={cx("sortSelect")}
                aria-label="Sắp xếp kết quả"
              >
                <option value="popular">Phổ biến</option>
                <option value="newest">Mới nhất</option>
                <option value="priceAsc">Giá: Thấp → Cao</option>
                <option value="priceDesc">Giá: Cao → Thấp</option>
              </select>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        {visibleEvents.length > 0 ? (
          <div className={cx("grid")}>
            {visibleEvents.map((event, index) => (
              <EventCardList
                key={event.id}
                event={event}
                index={index}
                onBook={goDetail}   // click nút đặt vé
                onClick={goDetail}  // nếu card clickable
              />
            ))}
          </div>
        ) : (
          <div className={cx("emptyState")}>
            Không tìm thấy sự kiện phù hợp.
          </div>
        )}

        {/* Load more */}
        <div className={cx("loadMore")}>
          <Button
            className={cx("btn_loadMore")}
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            disabled={!canLoadMore}
            aria-disabled={!canLoadMore}
          >
            {canLoadMore ? "Tải thêm sự kiện" : "Đã hiển thị tất cả"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Events;
