import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import styles from './Payment.module.scss';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '~/components/Breadcrumb';

const cx = classNames.bind(styles);

// ─── Mock Data ────────────────────────────────────────────────────────────────

// Fallback khi không có Router state (dev/test trực tiếp)
export const MOCK_ORDER = {
    success: true,
    message: 'Lấy dữ liệu thành công',
    data: {
        event: {
            id: 'eras-tour-2024',
            title: 'The Eras Tour - Taylor Swift',
            date: '28 Tháng 12, 2024',
            location: 'Sân vận động Quốc gia, Singapore',
        },
        tickets: [
            { id: 'vip', name: 'Vé VIP', quantity: 2, price: 1500000 },
        ],
        serviceFee: 50000,
    },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
    { id: 'momo',    label: 'Ví MoMo',    badge: 'M' },
    { id: 'zalopay', label: 'Ví ZaloPay', badge: 'Z' },
    { id: 'vnpay',   label: 'Ví VNPay',   badge: 'V' },
];

const INITIAL_FORM = { fullName: '', phone: '', email: '' };
const INITIAL_ERRORS = { fullName: '', phone: '', email: '' };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value) {
    return `${new Intl.NumberFormat('vi-VN').format(value)}đ`;
}

function validateForm(formData) {
    const errors = { ...INITIAL_ERRORS };
    let isValid = true;

    if (!formData.fullName.trim()) {
        errors.fullName = 'Vui lòng nhập họ và tên.';
        isValid = false;
    }

    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!formData.phone.trim()) {
        errors.phone = 'Vui lòng nhập số điện thoại.';
        isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
        errors.phone = 'Số điện thoại không hợp lệ.';
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
        errors.email = 'Vui lòng nhập email.';
        isValid = false;
    } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Email không hợp lệ.';
        isValid = false;
    }

    return { errors, isValid };
}

// ─── Component ────────────────────────────────────────────────────────────────

function Payment() {
    const location = useLocation();

    const [orderInfo, setOrderInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState(INITIAL_ERRORS);
    const [touched, setTouched] = useState({});

    const [selectedPayment, setSelectedPayment] = useState('momo');
    const [agreed, setAgreed] = useState(false);

    // ─── Fetch order info ──────────────────────────────────────────────────

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);

                // Ưu tiên data từ Router state (truyền từ Booking)
                if (location.state?.orderInfo) {
                    setOrderInfo(location.state.orderInfo);
                } else {
                    // Fallback: gọi API hoặc dùng mock
                    // const result = await getOrder();
                    const result = MOCK_ORDER;
                    if (result.success) {
                        setOrderInfo(result.data);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [location.state]);

    // ─── Derived ───────────────────────────────────────────────────────────

    const ticketTotal = orderInfo?.tickets?.reduce(
        (sum, t) => sum + t.price * t.quantity,
        0,
    ) ?? 0;

    const grandTotal = ticketTotal + (orderInfo?.serviceFee ?? 0);

    const canSubmit = agreed && selectedPayment && !submitting;

    // ─── Handlers ──────────────────────────────────────────────────────────

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error khi user bắt đầu sửa
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));

        const { errors: newErrors } = validateForm(formData);
        setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    };

    const handleSubmit = async () => {
        // Validate toàn bộ form trước khi submit
        const { errors: newErrors, isValid } = validateForm(formData);
        setErrors(newErrors);
        setTouched({ fullName: true, phone: true, email: true });

        if (!isValid || !agreed || !selectedPayment) return;

        try {
            setSubmitting(true);
            // await submitPayment({ ...formData, selectedPayment, orderInfo });
            console.log('Submit:', { formData, selectedPayment, orderInfo });
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Early returns ─────────────────────────────────────────────────────

    if (loading) {
        return (
            <main className={cx('wrapper')}>
                <div className={cx('container')}>
                    <p className={cx('loadingText')}>Đang tải...</p>
                </div>
            </main>
        );
    }

    // ─── JSX ───────────────────────────────────────────────────────────────

    return (
        <main className={cx('wrapper')}>
            <div className={cx('container')}>

                {/* Breadcrumb */}
                <Breadcrumb className={cx('breadcrumb')}>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink to={`/events/${orderInfo?.event?.id}/booking`}>
                                Chọn vé
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbPage>Thông tin & Thanh toán</BreadcrumbPage>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <span className={cx('breadcrumbText')}>Hoàn thành</span>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Page Header */}
                <header className={cx('pageHeader')}>
                    <h1>Thông tin & Thanh toán</h1>
                </header>

                <div className={cx('layout')}>
                    {/* ── Main Column ── */}
                    <div className={cx('mainColumn')}>

                        {/* Contact Info */}
                        <section className={cx('card')}>
                            <div className={cx('cardHeader')}>
                                <h2>Thông tin liên hệ</h2>
                            </div>

                            <div className={cx('cardBody')}>
                                <div className={cx('formRow')}>
                                    <div className={cx('formGroup')}>
                                        <label htmlFor="fullName">Họ và Tên</label>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={cx('input', {
                                                inputError: touched.fullName && errors.fullName,
                                            })}
                                            autoComplete="name"
                                        />
                                        {touched.fullName && errors.fullName && (
                                            <span className={cx('errorText')}>{errors.fullName}</span>
                                        )}
                                    </div>

                                    <div className={cx('formGroup')}>
                                        <label htmlFor="phone">Số điện thoại</label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={cx('input', {
                                                inputError: touched.phone && errors.phone,
                                            })}
                                            autoComplete="tel"
                                        />
                                        {touched.phone && errors.phone && (
                                            <span className={cx('errorText')}>{errors.phone}</span>
                                        )}
                                    </div>
                                </div>

                                <div className={cx('formGroup')}>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={cx('input', {
                                            inputError: touched.email && errors.email,
                                        })}
                                        autoComplete="email"
                                    />
                                    {touched.email && errors.email && (
                                        <span className={cx('errorText')}>{errors.email}</span>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Payment Methods */}
                        <section className={cx('card')}>
                            <div className={cx('cardHeader')}>
                                <h2>Chọn phương thức thanh toán</h2>
                            </div>

                            <div className={cx('cardBody', 'paymentBody')}>
                                {PAYMENT_METHODS.map((method) => {
                                    const isSelected = selectedPayment === method.id;

                                    return (
                                        <label
                                            key={method.id}
                                            className={cx('paymentOption', {
                                                paymentSelected: isSelected,
                                            })}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={isSelected}
                                                onChange={() => setSelectedPayment(method.id)}
                                                className={cx('radioInput')}
                                            />
                                            <span className={cx('radioControl')} />
                                            <span
                                                className={cx('paymentBadge', `badge-${method.id}`)}
                                            >
                                                {method.badge}
                                            </span>
                                            <span className={cx('paymentLabel')}>
                                                {method.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* ── Summary Sidebar ── */}
                    <aside className={cx('summaryCard')}>
                        <div className={cx('summaryHeader')}>
                            <h2>Tóm tắt đơn hàng</h2>
                        </div>

                        <div className={cx('summaryBody')}>
                            {/* Event Info */}
                            <div className={cx('eventInfo')}>
                                <p className={cx('eventTitle')}>{orderInfo?.event?.title}</p>

                                <div className={cx('eventMeta')}>
                                    <span>
                                        <FiCalendar />
                                        {orderInfo?.event?.date}
                                    </span>
                                    <span>
                                        <FiMapPin />
                                        {orderInfo?.event?.location}
                                    </span>
                                </div>
                            </div>

                            <div className={cx('divider')} />

                            {/* Order Rows */}
                            <div className={cx('summaryRows')}>
                                {orderInfo?.tickets?.map((ticket) => (
                                    <div key={ticket.id} className={cx('summaryRow')}>
                                        <span>
                                            {ticket.name} ({ticket.quantity} ×{' '}
                                            {formatCurrency(ticket.price)})
                                        </span>
                                        <strong>
                                            {formatCurrency(ticket.price * ticket.quantity)}
                                        </strong>
                                    </div>
                                ))}

                                <div className={cx('summaryRow')}>
                                    <span>Phí dịch vụ</span>
                                    <strong>{formatCurrency(orderInfo?.serviceFee ?? 0)}</strong>
                                </div>
                            </div>

                            <div className={cx('divider')} />

                            {/* Total */}
                            <div className={cx('totalRow')}>
                                <span>Tổng cộng</span>
                                <strong className={cx('totalAmount')}>
                                    {formatCurrency(grandTotal)}
                                </strong>
                            </div>

                            {/* Terms */}
                            <label className={cx('termsRow')}>
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className={cx('checkbox')}
                                />
                                <span className={cx('termsText')}>
                                    Tôi đã đọc và đồng ý với{' '}
                                    <Link to="/terms" className={cx('termsLink')}>
                                        Điều khoản &amp; Dịch vụ
                                    </Link>{' '}
                                    của EventBooking.
                                </span>
                            </label>

                            {/* Submit */}
                            <button
                                type="button"
                                className={cx('submitButton')}
                                disabled={!canSubmit}
                                onClick={handleSubmit}
                            >
                                {submitting ? 'Đang xử lý...' : 'Thanh toán'}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default Payment;