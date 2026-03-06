import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import {
  FiCheckCircle,
  FiUser,
  FiCalendar,
  FiMapPin,
  FiDownload,
  FiMail,
  FiPrinter,
} from "react-icons/fi";

import styles from "./CheckoutSuccess.module.scss";
import Card from "~/Components/Card";
import Button from "~/Components/Button";
import Image from "~/Components/Image";
import { images } from "~/assets";

const cx = classNames.bind(styles);

function formatVnd(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "0 VND";
  return `${n.toLocaleString("vi-VN")} VND`;
}

/** Mock cho demo */
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Đại nhạc hội Mùa Hè Sôi Động 2024",
    datetimeText: "19:00 - Thứ Bảy, 28/12/2024",
    venueText: "Sân vận động Mỹ Đình, Hà Nội",
    cover: images?.event ?? "",
  },
  {
    id: 2,
    title: "Vibrant Beats Music Festival 2024",
    datetimeText: "19:00 - October 26, 2024",
    venueText: "Grand City Convention Center",
    cover: images?.event ?? "",
  },
];

const MOCK_SUCCESS_ORDERS = [
  {
    eventId: "1",
    ticketType: "Vé VIP",
    customerName: "Nguyễn Văn A",
    orderId: "EB12345678",
    orderDate: "20/10/2024",
    total: 1200000,
    paymentMethod: "Ví MoMo",
    emailHint:
      "Vé của bạn đã được gửi đến email. Vui lòng kiểm tra hộp thư và chuẩn bị sẵn sàng cho một sự kiện khó quên.",
  },
  {
    eventId: "2",
    ticketType: "Vé Thường",
    customerName: "Trần Thị B",
    orderId: "EB87654321",
    orderDate: "21/10/2024",
    total: 350000,
    paymentMethod: "VNPAY",
    emailHint:
      "Đặt vé thành công! Bạn có thể tải vé PDF hoặc kiểm tra email để lấy vé điện tử.",
  },
];

function CheckoutSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId: routeEventId } = useParams();
  const eventId = String(routeEventId ?? "1");

  const [events] = useState(() => MOCK_EVENTS);
  const [successOrders] = useState(() => MOCK_SUCCESS_ORDERS);

  const event = useMemo(() => {
    return events.find((e) => String(e.id) === String(eventId)) ?? events[0] ?? null;
  }, [events, eventId]);

  const [data, setData] = useState(() => {
    // init lần đầu: ưu tiên state, không có thì fallback mock
    const st = location.state || null;

    if (st?.order || st?.form || st?.payment) {
      const paymentText =
        st.payment === "momo"
          ? "Ví MoMo"
          : st.payment === "zalopay"
            ? "Ví ZaloPay"
            : st.payment === "vnpay"
              ? "VNPAY"
              : "Thanh toán";

      const total =
        Number(st?.order?.total ?? st?.checkoutState?.totalPrice ?? st?.order?.totalPrice) || 0;

      return {
        eventId,
        ticketType: st?.checkoutState?.ticketType ?? "Vé điện tử",
        customerName: st?.form?.fullName ?? "Khách hàng",
        orderId: st?.orderId ?? "EB12345678",
        orderDate: st?.orderDate ?? new Date().toLocaleDateString("vi-VN"),
        total,
        paymentMethod: paymentText,
        emailHint:
          "Vé của bạn đã được gửi đến email. Vui lòng kiểm tra hộp thư và chuẩn bị sẵn sàng cho một sự kiện khó quên.",
      };
    }

    // fallback mock
    return (
      successOrders.find((o) => String(o.eventId) === String(eventId)) ??
      successOrders[0]
    );
  });

  useEffect(() => {
    const st = location.state || null;

    if (st?.order || st?.form || st?.payment) {
      const paymentText =
        st.payment === "momo"
          ? "Ví MoMo"
          : st.payment === "zalopay"
            ? "Ví ZaloPay"
            : st.payment === "vnpay"
              ? "VNPAY"
              : "Thanh toán";

      const total =
        Number(st?.order?.total ?? st?.checkoutState?.totalPrice ?? st?.order?.totalPrice) || 0;

      setData({
        eventId,
        ticketType: st?.checkoutState?.ticketType ?? "Vé điện tử",
        customerName: st?.form?.fullName ?? "Khách hàng",
        orderId: st?.orderId ?? "EB12345678",
        orderDate: st?.orderDate ?? new Date().toLocaleDateString("vi-VN"),
        total,
        paymentMethod: paymentText,
        emailHint:
          "Vé của bạn đã được gửi đến email. Vui lòng kiểm tra hộp thư và chuẩn bị sẵn sàng cho một sự kiện khó quên.",
      });
      return;
    }

    // không có state => dùng mock theo eventId
    const fallback =
      successOrders.find((o) => String(o.eventId) === String(eventId)) ??
      successOrders[0];

    setData(fallback);
  }, [eventId, location.state, successOrders]);

  const onDownloadPdf = useCallback(() => {
    console.log("Download PDF:", data?.orderId);
    // TODO: gọi API thật
  }, [data?.orderId]);

  const onResendEmail = useCallback(() => {
    console.log("Resend Email:", data?.orderId);
    // TODO: gọi API thật
  }, [data?.orderId]);

  const onPrint = useCallback(() => {
    window.print();
  }, []);

  const goHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  if (!event || !data) return null;

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        {/* Top badge */}
        <div className={cx("statusPill")} role="status" aria-live="polite">
          <FiCheckCircle size={14} aria-hidden />
          <span>Thanh toán thành công</span>
        </div>

        <h1 className={cx("title")}>Đặt vé thành công!</h1>
        <p className={cx("subtitle")}>{data.emailHint}</p>

        <div className={cx("grid")}>
          {/* LEFT */}
          <div className={cx("left")}>
            {/* E-ticket */}
            <Card className={cx("card")} variant="default">
              <div className={cx("ticket")}>
                <div className={cx("poster")}>
                  <Image
                    src={event.cover}
                    alt={`Poster sự kiện: ${event.title}`}
                    ratio={3 / 4}
                    fit="cover"
                    className={cx("posterImg")}
                    decoding="async"
                    lazy
                  />
                </div>

                <div className={cx("ticketBody")}>
                  <div className={cx("ticketTag")}>VÉ ĐIỆN TỬ</div>
                  <div className={cx("eventName")}>{event.title}</div>

                  <div className={cx("meta")}>
                    <div className={cx("metaRow")}>
                      <FiUser size={16} aria-hidden />
                      <span>
                        {data.customerName} - {data.ticketType}
                      </span>
                    </div>

                    <div className={cx("metaRow")}>
                      <FiCalendar size={16} aria-hidden />
                      <span>{event.datetimeText}</span>
                    </div>

                    <div className={cx("metaRow")}>
                      <FiMapPin size={16} aria-hidden />
                      <span>{event.venueText}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* QR */}
            <Card className={cx("card")} variant="default">
              <div className={cx("qrBlock")}>
                <div className={cx("qrLeft")}>
                  <div className={cx("qrTitle")}>Mã vé của bạn</div>
                  <div className={cx("qrDesc")}>
                    Sử dụng mã QR này hoặc mã vé dưới đây để check-in tại cổng sự kiện.
                    Vui lòng không chia sẻ mã này cho bất kỳ ai.
                  </div>

                  <div className={cx("codePill")} aria-label="Mã vé">
                    {data.orderId}
                  </div>
                </div>

                <div className={cx("qrBox")} aria-label="QR code">
                  {/* Demo placeholder - thay bằng QR thật sau */}
                  <div className={cx("qrFake")} aria-hidden />
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT */}
          <div className={cx("right")}>
            {/* Order details */}
            <Card className={cx("card")} variant="default">
              <div className={cx("sideTitle")}>Chi tiết đơn hàng</div>

              <div className={cx("kv")}>
                <div className={cx("kvRow")}>
                  <span className={cx("kvLabel")}>Mã đơn hàng</span>
                  <span className={cx("kvValue")}>{data.orderId}</span>
                </div>

                <div className={cx("kvRow")}>
                  <span className={cx("kvLabel")}>Ngày đặt vé</span>
                  <span className={cx("kvValue")}>{data.orderDate}</span>
                </div>

                <div className={cx("kvRow")}>
                  <span className={cx("kvLabel")}>Tổng thanh toán</span>
                  <span className={cx("kvValueStrong")}>{formatVnd(data.total)}</span>
                </div>

                <div className={cx("kvRow")}>
                  <span className={cx("kvLabel")}>Thanh toán qua</span>
                  <span className={cx("kvValue")}>{data.paymentMethod}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className={cx("card")} variant="default">
              <div className={cx("sideTitle")}>Hành động</div>

              <div className={cx("actions")}>
                <Button className={cx("primaryBtn")} onClick={onDownloadPdf}>
                  <FiDownload size={16} aria-hidden />
                  Tải vé PDF
                </Button>

                <Button className={cx("ghostBtn")} onClick={onResendEmail}>
                  <FiMail size={16} aria-hidden />
                  Gửi lại Email
                </Button>

                <Button className={cx("ghostBtn")} onClick={onPrint}>
                  <FiPrinter size={16} aria-hidden />
                  In vé
                </Button>
              </div>

              <div className={cx("backHome")}>
                <Link
                  className={cx("backLink")}
                  to="/"
                  onClick={(e) => {
                    e.preventDefault();
                    goHome();
                  }}
                >
                  Trở về trang chủ
                </Link>
              </div>
            </Card>
          </div>
        </div>

        <div className={cx("srOnly")}>eventId: {eventId}</div>
      </div>
    </div>
  );
}
export default CheckoutSuccess;