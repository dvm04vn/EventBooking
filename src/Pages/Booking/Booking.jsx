import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Booking.module.scss";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/Components/Breadcrumb";

const cx = classNames.bind(styles);

const EVENT_BOOKING_DATA = {
  1: {
    id: 1,
    title: "The Grand Concert",
    dateText: "Thứ Bảy, 28 tháng 12, 2024 - 20:00",
    ticketTypes: [
      {
        id: "regular",
        name: "Vé Thường",
        price: 250000,
        priceText: "250.000 VND",
        desc: "Vé vào cửa tiêu chuẩn.",
        icon: "🎫",
        max: 10,
        soldOut: false,
      },
      {
        id: "vip",
        name: "Vé VIP",
        price: 500000,
        priceText: "500.000 VND",
        desc: "Bao gồm quyền lợi vào khu vực lounge và đồ uống miễn phí.",
        icon: "🎟️",
        max: 10,
        soldOut: false,
      },
      {
        id: "early-bird",
        name: "Vé Early Bird",
        price: 150000,
        priceText: "150.000 VND",
        desc: "Giá ưu đãi cho những người đặt sớm nhất.",
        icon: "🕒",
        max: 0,
        soldOut: true,
      },
    ],
    holdMinutes: 10,
  },
  5: {
    id: 5,
    title: "Ravolution Music Festival",
    dateText: "Thứ Bảy, 14 tháng 12, 2024 - 18:00",
    ticketTypes: [
      {
        id: "standard",
        name: "Vé Standard",
        price: 800000,
        priceText: "800.000 VND",
        desc: "Khu vực tiêu chuẩn gần sân khấu.",
        icon: "🎫",
        max: 10,
        soldOut: false,
      },
      {
        id: "vip",
        name: "Vé VIP",
        price: 1200000,
        priceText: "1.200.000 VND",
        desc: "Vị trí đẹp hơn và lối vào ưu tiên.",
        icon: "🎟️",
        max: 10,
        soldOut: false,
      },
      {
        id: "vvip",
        name: "Vé VVIP",
        price: 2500000,
        priceText: "2.500.000 VND",
        desc: "Trải nghiệm cao cấp với đặc quyền backstage.",
        icon: "⭐",
        max: 10,
        soldOut: false,
      },
    ],
    holdMinutes: 10,
  },
};

const SEAT_ROWS = ["A", "B", "C", "D"];
const SEAT_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
const TAKEN_SEATS = ["A2", "A5", "B1", "B6", "C3", "D8"];

function formatCurrency(value) {
  return `${value.toLocaleString("vi-VN")} VND`;
}

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = EVENT_BOOKING_DATA[id] || EVENT_BOOKING_DATA[1];

  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    event.ticketTypes.forEach((ticket) => {
      initial[ticket.id] = 0;
    });
    return initial;
  });

  const [selectedSeats, setSelectedSeats] = useState(["B4", "C7", "A8"]);

  const handleChangeQuantity = useCallback((ticketId, delta, max, soldOut) => {
    if (soldOut) return;

    setQuantities((prev) => {
      const current = prev[ticketId] || 0;
      const next = Math.max(0, Math.min(max, current + delta));

      return {
        ...prev,
        [ticketId]: next,
      };
    });
  }, []);

  const handleToggleSeat = useCallback((seatId) => {
    if (TAKEN_SEATS.includes(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((seat) => seat !== seatId);
      }

      return [...prev, seatId];
    });
  }, []);

  const summary = useMemo(() => {
    const selectedTickets = event.ticketTypes
      .map((ticket) => ({
        ...ticket,
        quantity: quantities[ticket.id] || 0,
        total: (quantities[ticket.id] || 0) * ticket.price,
      }))
      .filter((ticket) => ticket.quantity > 0);

    const total = selectedTickets.reduce((sum, item) => sum + item.total, 0);

    return {
      selectedTickets,
      total,
      seatCount: selectedSeats.length,
    };
  }, [event.ticketTypes, quantities, selectedSeats]);

  const handleContinue = useCallback(() => {
    navigate(`/events/${event.id}/payment`);
  }, [navigate, event.id]);

  return (
    <main className={cx("page")}>
      <div className={cx("container")}>
        <Breadcrumb className={cx("breadcrumb")}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to={`/events/${event.id}`}>
                Chi tiết sự kiện
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Chọn vé</BreadcrumbPage>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <span className={cx("breadcrumbText")}>Thanh toán</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className={cx("title")}>{event.title}</h1>
        <p className={cx("date")}>{event.dateText}</p>

        <div className={cx("layout")}>
          <div className={cx("main")}>
            <section className={cx("card")}>
              <h2 className={cx("cardTitle")}>Chọn loại vé</h2>

              <div className={cx("ticketList")}>
                {event.ticketTypes.map((ticket) => {
                  const quantity = quantities[ticket.id] || 0;

                  return (
                    <div
                      key={ticket.id}
                      className={cx("ticketRow", {
                        soldOut: ticket.soldOut,
                      })}
                    >
                      <div className={cx("ticketInfo")}>
                        <div className={cx("ticketIcon")}>{ticket.icon}</div>

                        <div className={cx("ticketText")}>
                          <h3 className={cx("ticketName")}>{ticket.name}</h3>
                          <p className={cx("ticketPrice")}>{ticket.priceText}</p>
                          <p className={cx("ticketDesc")}>
                            {ticket.soldOut ? "Đã bán hết" : ticket.desc}
                          </p>
                        </div>
                      </div>

                      <div className={cx("stepper")}>
                        <button
                          type="button"
                          className={cx("stepBtn")}
                          onClick={() =>
                            handleChangeQuantity(
                              ticket.id,
                              -1,
                              ticket.max,
                              ticket.soldOut
                            )
                          }
                          disabled={ticket.soldOut || quantity === 0}
                        >
                          -
                        </button>

                        <span className={cx("stepValue")}>{quantity}</span>

                        <button
                          type="button"
                          className={cx("stepBtn")}
                          onClick={() =>
                            handleChangeQuantity(
                              ticket.id,
                              1,
                              ticket.max,
                              ticket.soldOut
                            )
                          }
                          disabled={ticket.soldOut || quantity >= ticket.max}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className={cx("card")}>
              <div className={cx("seatHead")}>
                <h2 className={cx("cardTitle")}>Sơ đồ chỗ ngồi</h2>

                <div className={cx("legend")}>
                  <div className={cx("legendItem")}>
                    <span className={cx("legendBox", "empty")} />
                    <span>Trống</span>
                  </div>

                  <div className={cx("legendItem")}>
                    <span className={cx("legendBox", "selected")} />
                    <span>Đang chọn</span>
                  </div>

                  <div className={cx("legendItem")}>
                    <span className={cx("legendBox", "taken")} />
                    <span>Đã đặt</span>
                  </div>
                </div>
              </div>

              <div className={cx("stage")}>SÂN KHẤU</div>

              <div className={cx("seatMap")}>
                {SEAT_ROWS.map((row) => (
                  <div key={row} className={cx("seatRow")}>
                    {SEAT_NUMBERS.map((number) => {
                      const seatId = `${row}${number}`;
                      const isTaken = TAKEN_SEATS.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          type="button"
                          className={cx("seat", {
                            selected: isSelected,
                            taken: isTaken,
                          })}
                          onClick={() => handleToggleSeat(seatId)}
                          disabled={isTaken}
                          title={seatId}
                        >
                          {seatId}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className={cx("sidebar")}>
            <section className={cx("summary")}>
              <h2 className={cx("summaryTitle")}>Tóm tắt vé của bạn</h2>

              <div className={cx("summaryList")}>
                {summary.selectedTickets.length > 0 ? (
                  summary.selectedTickets.map((ticket) => (
                    <div key={ticket.id} className={cx("summaryRow")}>
                      <span>
                        {ticket.name} (x{ticket.quantity})
                      </span>
                      <span>{formatCurrency(ticket.total)}</span>
                    </div>
                  ))
                ) : (
                  <div className={cx("summaryEmpty")}>
                    Bạn chưa chọn loại vé nào.
                  </div>
                )}

                <div className={cx("summaryRow")}>
                  <span>Ghế đã chọn ({summary.seatCount})</span>
                  <span>
                    {summary.seatCount > 0 ? selectedSeats.join(", ") : "--"}
                  </span>
                </div>
              </div>

              <div className={cx("summaryTotal")}>
                <span>Tổng cộng</span>
                <strong>{formatCurrency(summary.total)}</strong>
              </div>

              <div className={cx("holdBox")}>
                Ghế của bạn được giữ trong {event.holdMinutes}:00
              </div>

              <button
                type="button"
                className={cx("continueBtn")}
                onClick={handleContinue}
                disabled={summary.selectedTickets.length === 0}
              >
                Tiếp tục
              </button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Booking;