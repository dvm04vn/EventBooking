import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import { FiCalendar, FiMapPin } from "react-icons/fi";

import styles from "./CheckoutInfo.module.scss";
import Card from "~/Components/Card";
import Button from "~/Components/Button";
import Breadcrumb from "~/Components/Breadcrumb";

const cx = classNames.bind(styles);

const PAYMENT_METHODS = [
  { key: "momo", label: "Ví MoMo" },
  { key: "zalopay", label: "Ví ZaloPay" },
  { key: "vnpay", label: "VNPAY" },
];

function formatVnd(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "0đ";
  return `${n.toLocaleString("vi-VN")}đ`;
}

/** Mock cho demo */
const MOCK_EVENTS = [
  {
    id: 1,
    title: "The Eras Tour - Taylor Swift",
    dateText: "28 Tháng 12, 2024",
    venueText: "Sân vận động Quốc gia, Singapore",
    basePrice: 1500000,
    fee: 50000,
  },
  {
    id: 2,
    title: "The Grand Concert",
    dateText: "Thứ Bảy, 28 tháng 12, 2024",
    venueText: "Grand City Convention Center",
    basePrice: 750000,
    fee: 30000,
  },
];

function CheckoutInfo() {
  const navigate = useNavigate();
  const { eventId: routeEventId } = useParams(); // /checkout/:eventId/info
  const location = useLocation();

  const eventId = useMemo(() => String(routeEventId ?? "1"), [routeEventId]);

  // ✅ nhận state từ bước Checkout (navigate(..., { state }))
  const checkoutState = location.state || null;

  // ✅ event state để render (theo đúng ý bạn)
  const [event, setEvent] = useState(() => MOCK_EVENTS[0]);

  // khi đổi eventId -> set event tương ứng
  useEffect(() => {
    const found = MOCK_EVENTS.find((e) => String(e.id) === String(eventId));
    setEvent(found ?? MOCK_EVENTS[0]);
  }, [eventId]);

  // ✅ order build dựa trên event + state (nếu có)
  const order = useMemo(() => {
    // Ưu tiên state từ Checkout (nếu user không refresh)
    if (checkoutState?.totalPrice != null) {
      const total = Number(checkoutState.totalPrice) || 0;

      // (tuỳ bạn) build items từ qty
      const qtyObj = checkoutState?.qty || {};
      const itemsFromQty = Object.entries(qtyObj)
        .filter(([, c]) => Number(c) > 0)
        .map(([k, c]) => ({
          label: `${k.toUpperCase()} (x${c})`,
          amount: 0, // nếu muốn show amount từng line thì bạn map từ bảng giá ở Checkout
        }));

      return {
        eventId,
        eventTitle: `Sự kiện: ${event?.title ?? ""}`,
        dateText: event?.dateText ?? "",
        venueText: event?.venueText ?? "",
        items:
          itemsFromQty.length > 0
            ? [...itemsFromQty, { label: "Tạm tính", amount: total }]
            : [{ label: "Tạm tính", amount: total }],
        total,
      };
    }

    // Fallback demo (khi refresh page mất state)
    const demoQty = 2;
    const unit = Number(event?.basePrice) || 0;
    const fee = Number(event?.fee) || 0;

    return {
      eventId,
      eventTitle: `Sự kiện: ${event?.title ?? ""}`,
      dateText: event?.dateText ?? "",
      venueText: event?.venueText ?? "",
      items: [
        { label: `Vé (x${demoQty} • ${formatVnd(unit)})`, amount: unit * demoQty },
        { label: "Phí dịch vụ", amount: fee },
      ],
      total: unit * demoQty + fee,
    };
  }, [checkoutState, eventId, event]);

  const [form, setForm] = useState({ fullName: "", phone: "", email: "" });
  const [payment, setPayment] = useState("momo");
  const [agree, setAgree] = useState(false);

  const onChange = useCallback(
    (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value })),
    []
  );

  const canPay = useMemo(() => {
    const okName = form.fullName.trim().length >= 2;
    const okPhone = form.phone.trim().length >= 8;
    const okEmail = form.email.trim().includes("@");
    return okName && okPhone && okEmail && !!payment && agree;
  }, [form, payment, agree]);

  const onPay = useCallback(() => {
    if (!canPay) return;

    // ✅ đúng route theo router của bạn: /checkout/:eventId/success
    navigate(`/checkout/${encodeURIComponent(eventId)}/success`, {
      state: {
        eventId,
        event,
        order,
        form,
        payment,
        checkoutState, // nếu cần dùng lại ở success
      },
    });
  }, [canPay, navigate, eventId, event, order, form, payment, checkoutState]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        {/* ✅ Breadcrumb 3 bước như ảnh */}
        <Breadcrumb
          items={[
            { label: "Chọn vé", to: `/checkout/${eventId}` },
            {
              label: "Thông tin & Thanh toán",
              to: `/checkout/${eventId}/info`,
              isActive: true,
            },
            { label: "Hoàn thành", to: `/checkout/${eventId}/success`, disabled: true },
          ]}
        />

        <h1 className={cx("pageTitle")}>Thông tin &amp; Thanh toán</h1>

        <div className={cx("grid")}>
          {/* LEFT */}
          <div className={cx("left")}>
            <Card className={cx("card")} variant="default">
              <div className={cx("cardHeader")}>
                <h2 className={cx("cardTitle")}>Thông tin liên hệ</h2>
              </div>

              <div className={cx("formGrid")}>
                <div className={cx("field")}>
                  <label className={cx("label")} htmlFor="fullName">
                    Họ và Tên
                  </label>
                  <input
                    id="fullName"
                    className={cx("input")}
                    value={form.fullName}
                    onChange={onChange("fullName")}
                    autoComplete="name"
                  />
                </div>

                <div className={cx("field")}>
                  <label className={cx("label")} htmlFor="phone">
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    className={cx("input")}
                    value={form.phone}
                    onChange={onChange("phone")}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>

                <div className={cx("fieldFull")}>
                  <label className={cx("label")} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    className={cx("input")}
                    value={form.email}
                    onChange={onChange("email")}
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
              </div>
            </Card>

            <Card className={cx("card")} variant="default">
              <div className={cx("cardHeader")}>
                <h2 className={cx("cardTitle")}>Chọn phương thức thanh toán</h2>
              </div>

              <div className={cx("payList")} role="radiogroup" aria-label="Phương thức thanh toán">
                {PAYMENT_METHODS.map((m) => {
                  const active = payment === m.key;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      className={cx("payOption", active && "payOptionActive")}
                      role="radio"
                      aria-checked={active}
                      onClick={() => setPayment(m.key)}
                    >
                      <span className={cx("radio")} aria-hidden>
                        <span className={cx(active ? "radioDotOn" : "radioDotOff")} />
                      </span>
                      <span className={cx("payLabel")}>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* RIGHT */}
          <div className={cx("right")}>
            <Card className={cx("card")} variant="default">
              <div className={cx("summaryHeader")}>
                <h2 className={cx("cardTitle")}>Tóm tắt đơn hàng</h2>
              </div>

              <div className={cx("eventTitle")}>{order.eventTitle}</div>

              <div className={cx("meta")}>
                <div className={cx("metaRow")}>
                  <FiCalendar aria-hidden size={16} />
                  <span>{order.dateText}</span>
                </div>
                <div className={cx("metaRow")}>
                  <FiMapPin aria-hidden size={16} />
                  <span>{order.venueText}</span>
                </div>
              </div>

              <div className={cx("divider")} />

              <div className={cx("lines")}>
                {order.items.map((it) => (
                  <div key={it.label} className={cx("line")}>
                    <span className={cx("lineLabel")}>{it.label}</span>
                    <span className={cx("lineAmount")}>{formatVnd(it.amount)}</span>
                  </div>
                ))}
              </div>

              <div className={cx("divider")} />

              <div className={cx("totalRow")}>
                <span className={cx("totalLabel")}>Tổng cộng</span>
                <span className={cx("totalValue")}>{formatVnd(order.total)}</span>
              </div>

              <label className={cx("agreeRow")}>
                <input
                  type="checkbox"
                  className={cx("checkbox")}
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span className={cx("agreeText")}>
                  Tôi đã đọc và đồng ý với <b>Điều khoản</b> &amp; <b>Dịch vụ</b> của EventBooking.
                </span>
              </label>

              <Button className={cx("payBtn")} onClick={onPay} disabled={!canPay} aria-disabled={!canPay}>
                Thanh toán
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CheckoutInfo;