import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import { FiMinus, FiPlus, FiChevronRight, FiInfo, FiCheck } from "react-icons/fi";

import styles from "./Checkout.module.scss";
import Card from "~/Components/Card";
import Button from "~/Components/Button";
import Breadcrumb from "~/Components/Breadcrumb";

const cx = classNames.bind(styles);

const MOCK_EVENTS = [
  {
    id: 1,
    title: "The Grand Concert",
    datetimeLabel: "Thứ Bảy, 28 tháng 12, 2024 - 20:00",
  },
  {
    id: 2,
    title: "Vibrant Beats Music Festival 2024",
    datetimeLabel: "Thứ Bảy, 26 tháng 10, 2024 - 19:00",
  },
];

const MOCK_TICKETS = [
  { id: "standard", name: "Vé Thường", price: 250000, desc: "Ngồi khu vực tiêu chuẩn." },
  { id: "vip", name: "Vé VIP", price: 750000, desc: "Bao gồm quà tặng và khu vực lounge + ưu đãi miễn phí." },
  { id: "earlybird", name: "Vé Early Bird", price: 150000, desc: "Giá bán rẻ — số lượng có hạn!", disabled: true },
];

/** Mock seat map */
const SEAT_ROWS = 5;
const SEAT_COLS = 10;
const RESERVED_SEATS = new Set(["B3", "B4", "C7", "D2", "D3", "E9"]);

function formatVnd(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0 VND";
  return `${n.toLocaleString("vi-VN")} VND`;
}

function seatId(rowIndex, colIndex) {
  const rowChar = String.fromCharCode(65 + rowIndex); // A, B, C...
  return `${rowChar}${colIndex + 1}`;
}

function Checkout() {
  const navigate = useNavigate();
  const { eventId: routeEventId } = useParams();
  const eventId = String(routeEventId ?? "1");

  // ✅ data mock để trong state (đúng yêu cầu của bạn)
  const [events] = useState(() => MOCK_EVENTS);
  const [tickets] = useState(() => MOCK_TICKETS);

  const event = useMemo(() => {
    return events.find((e) => String(e.id) === String(eventId)) ?? events[0] ?? null;
  }, [events, eventId]);

  // qty by ticket id
  const [qty, setQty] = useState(() => ({
    standard: 0,
    vip: 0,
    earlybird: 0,
  }));

  // selected seat ids (Set)
  const [selectedSeats, setSelectedSeats] = useState(() => new Set());

  const totalTicketCount = useMemo(() => {
    return Object.values(qty).reduce((sum, n) => sum + (Number(n) || 0), 0);
  }, [qty]);

  const ticketLines = useMemo(() => {
    return tickets
      .map((t) => {
        const count = Number(qty[t.id] || 0);
        return { ...t, count, lineTotal: count * t.price };
      })
      .filter((t) => t.count > 0);
  }, [tickets, qty]);

  const totalPrice = useMemo(() => {
    return ticketLines.reduce((sum, t) => sum + t.lineTotal, 0);
  }, [ticketLines]);

  const selectedSeatsArray = useMemo(() => Array.from(selectedSeats), [selectedSeats]);

  // ✅ Khi giảm số vé: nếu số ghế đang chọn > số vé thì cắt bớt
  useEffect(() => {
    setSelectedSeats((prev) => {
      if (prev.size <= totalTicketCount) return prev;

      const next = new Set();
      let i = 0;
      for (const seat of prev) {
        if (i >= totalTicketCount) break;
        next.add(seat);
        i += 1;
      }
      return next;
    });
  }, [totalTicketCount]);

  const canContinue = useMemo(() => {
    if (totalTicketCount <= 0) return false;
    // nếu muốn bắt buộc ghế = số vé:
    // return selectedSeats.size === totalTicketCount;
    return true;
  }, [totalTicketCount /*, selectedSeats*/]);

  const inc = useCallback((ticketId) => {
    setQty((prev) => ({ ...prev, [ticketId]: (prev[ticketId] || 0) + 1 }));
  }, []);

  const dec = useCallback((ticketId) => {
    setQty((prev) => {
      const nextVal = Math.max(0, (prev[ticketId] || 0) - 1);
      return { ...prev, [ticketId]: nextVal };
    });
  }, []);

  const toggleSeat = useCallback(
    (id) => {
      if (RESERVED_SEATS.has(id)) return;

      // ✅ chưa chọn vé thì không cho chọn ghế
      if (totalTicketCount <= 0) return;

      setSelectedSeats((prev) => {
        const next = new Set(prev);

        // bỏ chọn
        if (next.has(id)) {
          next.delete(id);
          return next;
        }

        // chọn thêm nhưng không vượt quá số vé
        if (next.size >= totalTicketCount) return next;

        next.add(id);
        return next;
      });
    },
    [totalTicketCount]
  );

  const handleContinue = useCallback(() => {
    if (!canContinue) return;

    navigate(`/checkout/${encodeURIComponent(eventId)}/info`, {
      state: {
        eventId,
        event,
        qty,
        selectedSeats: selectedSeatsArray,
        ticketLines,
        totalPrice,
      },
    });
  }, [canContinue, navigate, eventId, event, qty, selectedSeatsArray, ticketLines, totalPrice]);

  if (!event) return null;

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <Breadcrumb
          className={cx("breadcrumbFix")}
          items={[
            { label: "Chi tiết sự kiện", to: `/events/${eventId}` },
            { label: "Chọn vé", to: `/checkout/${eventId}`, isActive: true },
            { label: "Thanh toán", to: `/checkout/${eventId}/info`, disabled: true },
          ]}
        />

        {/* Header */}
        <div className={cx("pageHeader")}>
          <h1 className={cx("title")}>{event.title}</h1>
          <div className={cx("subTitle")}>{event.datetimeLabel}</div>
        </div>

        <div className={cx("layout")}>
          {/* LEFT */}
          <div className={cx("left")}>
            {/* Ticket types */}
            <Card className={cx("panel")} variant="default">
              <div className={cx("panelTitle")}>Chọn loại vé</div>

              <div className={cx("ticketList")}>
                {tickets.map((t) => {
                  const count = Number(qty[t.id] || 0);
                  const isDisabled = !!t.disabled;

                  return (
                    <div
                      key={t.id}
                      className={cx("ticketRow", isDisabled && "ticketRowDisabled")}
                      aria-disabled={isDisabled || undefined}
                    >
                      <div className={cx("ticketInfo")}>
                        <div className={cx("ticketName")}>
                          {t.name}
                          {isDisabled ? <span className={cx("ticketBadge")}>Hết</span> : null}
                        </div>

                        <div className={cx("ticketPrice")}>{formatVnd(t.price)}</div>
                        <div className={cx("ticketDesc")}>{t.desc}</div>
                      </div>

                      <div className={cx("stepper")}>
                        <button
                          type="button"
                          className={cx("stepBtn")}
                          onClick={() => dec(t.id)}
                          disabled={isDisabled || count <= 0}
                          aria-label={`Giảm số lượng ${t.name}`}
                        >
                          <FiMinus size={16} aria-hidden />
                        </button>

                        <div className={cx("count")} aria-label={`Số lượng ${t.name}`}>
                          {count}
                        </div>

                        <button
                          type="button"
                          className={cx("stepBtn")}
                          onClick={() => inc(t.id)}
                          disabled={isDisabled}
                          aria-label={`Tăng số lượng ${t.name}`}
                        >
                          <FiPlus size={16} aria-hidden />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Seat map */}
            <Card className={cx("panel")} variant="default">
              <div className={cx("seatHeader")}>
                <div className={cx("panelTitle")}>Sơ đồ chỗ ngồi</div>

                <div className={cx("legend")} aria-label="Chú thích ghế">
                  <span className={cx("legendItem")}>
                    <span className={cx("dot", "dotAvailable")} aria-hidden />
                    Trống
                  </span>
                  <span className={cx("legendItem")}>
                    <span className={cx("dot", "dotSelected")} aria-hidden />
                    Đang chọn
                  </span>
                  <span className={cx("legendItem")}>
                    <span className={cx("dot", "dotReserved")} aria-hidden />
                    Đã đặt
                  </span>
                </div>
              </div>

              <div className={cx("stage")} aria-label="Sân khấu">
                SÂN KHẤU
              </div>

              <div className={cx("seatGrid")} role="grid" aria-label="Sơ đồ chỗ ngồi">
                {Array.from({ length: SEAT_ROWS }).map((_, r) => (
                  <div key={r} className={cx("seatRow")} role="row">
                    {Array.from({ length: SEAT_COLS }).map((__, c) => {
                      const id = seatId(r, c);
                      const isReserved = RESERVED_SEATS.has(id);
                      const isSelected = selectedSeats.has(id);

                      return (
                        <button
                          key={id}
                          type="button"
                          className={cx(
                            "seat",
                            isReserved && "seatReserved",
                            isSelected && "seatSelected",
                            totalTicketCount <= 0 && "seatDisabled"
                          )}
                          onClick={() => toggleSeat(id)}
                          disabled={isReserved || totalTicketCount <= 0}
                          aria-pressed={isSelected}
                          aria-label={`Ghế ${id}${isReserved ? " (đã đặt)" : ""}${isSelected ? " (đang chọn)" : ""}`}
                        >
                          {isSelected ? <FiCheck size={12} aria-hidden /> : null}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT */}
          <div className={cx("right")}>
            <Card className={cx("summary")} variant="default">
              <div className={cx("summaryTitle")}>Tóm tắt vé của bạn</div>

              <div className={cx("summaryList")}>
                {ticketLines.length === 0 ? (
                  <div className={cx("summaryEmpty")}>Chưa chọn loại vé nào.</div>
                ) : (
                  ticketLines.map((t) => (
                    <div key={t.id} className={cx("summaryRow")}>
                      <div className={cx("summaryName")}>
                        {t.name} <span className={cx("summaryCount")}>(x{t.count})</span>
                      </div>
                      <div className={cx("summaryPrice")}>{formatVnd(t.lineTotal)}</div>
                    </div>
                  ))
                )}

                <div className={cx("summaryDivider")} />

                <div className={cx("summaryRow")}>
                  <div className={cx("summaryName")}>Ghế đã chọn ({selectedSeatsArray.length})</div>
                  <div className={cx("summarySeats")}>
                    {selectedSeatsArray.length ? selectedSeatsArray.join(", ") : "—"}
                  </div>
                </div>
              </div>

              <div className={cx("totalBlock")}>
                <div className={cx("totalLabel")}>Tổng cộng</div>
                <div className={cx("totalValue")}>{formatVnd(totalPrice)}</div>
              </div>

              <div className={cx("hint")}>
                <FiInfo size={14} aria-hidden />
                <span>Ghế của bạn đang được giữ trong 10:00 phút</span>
              </div>

              <Button
                className={cx("continueBtn")}
                onClick={handleContinue}
                disabled={!canContinue}
                aria-disabled={!canContinue}
              >
                Tiếp tục
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Checkout;