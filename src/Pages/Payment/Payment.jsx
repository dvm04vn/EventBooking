import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Payment.module.scss";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/Components/Breadcrumb";

const cx = classNames.bind(styles);

const PAYMENT_DATA = {
  1: {
    id: 1,
    title: "The Eras Tour - Taylor Swift",
    dateText: "28 Tháng 12, 2024",
    venue: "Sân vận động Quốc gia, Singapore",
    items: [
      { id: "ticket", label: "Vé (2 × 1.500.000đ)", amount: 3000000 },
      { id: "fee", label: "Phí dịch vụ", amount: 50000 },
    ],
  },
  5: {
    id: 5,
    title: "Ravolution Music Festival",
    dateText: "14 Tháng 12, 2024",
    venue: "SECC, Quận 7, TP.HCM",
    items: [
      { id: "ticket", label: "Vé (2 × 800.000đ)", amount: 1600000 },
      { id: "fee", label: "Phí dịch vụ", amount: 50000 },
    ],
  },
};

const PAYMENT_METHODS = [
  {
    id: "momo",
    name: "Ví MoMo",
    icon: "💙",
  },
  {
    id: "zalopay",
    name: "Ví ZaloPay",
    icon: "🟦",
  },
  {
    id: "vnpay",
    name: "Ví VNPay",
    icon: "💳",
  },
];

function formatCurrency(value) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = PAYMENT_DATA[id] || PAYMENT_DATA[1];

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [method, setMethod] = useState("momo");
  const [agreed, setAgreed] = useState(false);

  const total = useMemo(() => {
    return event.items.reduce((sum, item) => sum + item.amount, 0);
  }, [event.items]);

  const isFormValid =
    form.fullName.trim() &&
    form.phone.trim() &&
    form.email.trim() &&
    agreed &&
    method;

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isFormValid) return;
    navigate(`/events/${event.id}/success`);
  }, [event.id, isFormValid, navigate]);

  return (
    <main className={cx("page")}>
      <div className={cx("container")}>
        <Breadcrumb className={cx("breadcrumb")}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to={`/events/${event.id}/booking`}>
                Chọn vé
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Thông tin & Thanh toán</BreadcrumbPage>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <span className={cx("breadcrumbText")}>Hoàn thành</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className={cx("title")}>Thông tin & Thanh toán</h1>

        <div className={cx("layout")}>
          <div className={cx("main")}>
            <section className={cx("card")}>
              <h2 className={cx("cardTitle")}>Thông tin liên hệ</h2>

              <div className={cx("formGrid")}>
                <div className={cx("field")}>
                  <label className={cx("label")} htmlFor="fullName">
                    Họ và Tên
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className={cx("input")}
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                  />
                </div>

                <div className={cx("field")}>
                  <label className={cx("label")} htmlFor="phone">
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    type="text"
                    className={cx("input")}
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                <div className={cx("field", "full")}>
                  <label className={cx("label")} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={cx("input")}
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className={cx("card")}>
              <h2 className={cx("cardTitle")}>Chọn phương thức thanh toán</h2>

              <div className={cx("methodList")}>
                {PAYMENT_METHODS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={cx("methodItem", {
                      active: method === item.id,
                    })}
                    onClick={() => setMethod(item.id)}
                  >
                    <span className={cx("radio", { checked: method === item.id })}>
                      <span className={cx("radioDot")} />
                    </span>

                    <span className={cx("methodIcon")}>{item.icon}</span>

                    <span className={cx("methodName")}>{item.name}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className={cx("sidebar")}>
            <section className={cx("summary")}>
              <h2 className={cx("summaryTitle")}>Tóm tắt đơn hàng</h2>

              <div className={cx("eventBox")}>
                <h3 className={cx("eventTitle")}>Sự kiện: {event.title}</h3>

                <div className={cx("eventMeta")}>
                  <span>{event.dateText}</span>
                </div>

                <div className={cx("eventMeta")}>
                  <span>{event.venue}</span>
                </div>
              </div>

              <div className={cx("summaryList")}>
                {event.items.map((item) => (
                  <div key={item.id} className={cx("summaryRow")}>
                    <span>{item.label}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>

              <div className={cx("summaryTotal")}>
                <span>Tổng cộng</span>
                <strong>{formatCurrency(total)}</strong>
              </div>

              <label className={cx("agreeBox")}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  Tôi đã đọc và đồng ý với{" "}
                  <span className={cx("linkText")}>
                    Điều khoản & Dịch vụ
                  </span>{" "}
                  của EventBooking.
                </span>
              </label>

              <button
                type="button"
                className={cx("payBtn")}
                onClick={handleSubmit}
                disabled={!isFormValid}
              >
                Thanh toán
              </button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Payment;