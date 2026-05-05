import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import {
    FiAward,
    FiClock,
    FiMinus,
    FiPlus,
    FiShield,
} from 'react-icons/fi';
import { FaTicketAlt } from 'react-icons/fa';
import styles from './Booking.module.scss';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '~/components/Breadcrumb';

const cx = classNames.bind(styles);

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_EVENT = {
    id: 'grand-concert-2024',
    title: 'The Grand Concert',
    dateText: 'Thứ Bảy, 28 tháng 12, 2024 - 20:00',
};

export const MOCK_BOOKING = {
    success: true,
    message: 'Lấy dữ liệu thành công',
    data: [
        {
            id: 'standard',
            name: 'Vé Thường',
            price: 250000,
            description: 'Vé vào cửa tiêu chuẩn.',
            status: 'available',
        },
        {
            id: 'vip',
            name: 'Vé VIP',
            price: 750000,
            description: 'Bao gồm quyền lợi vào khu vực lounge và đồ uống miễn phí.',
            status: 'available',
        },
        {
            id: 'earlyBird',
            name: 'Vé Early Bird',
            price: 180000,
            description: 'Giá ưu đãi cho những người đặt sớm nhất.',
            status: 'sold_out',
        },
    ],
};

// ─── Constants ────────────────────────────────────────────────────────────────

// Map icon theo ticket id — không nhúng React component vào data
const TICKET_ICON_MAP = {
    standard: FaTicketAlt,
    vip: FiAward,
    earlyBird: FiShield,
};

const SEAT_ROWS = ['A', 'B', 'C'];
const LEFT_SEAT_NUMBERS = [1, 2, 3, 4, 5];
const RIGHT_SEAT_NUMBERS = [6, 7, 8, 9];

const BOOKED_SEATS = ['A1', 'A2', 'B2', 'C9'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value) {
    return `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`;
}

function getTotalTickets(quantities) {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
}

function buildInitialQuantities(ticketTypes) {
    return ticketTypes.reduce((acc, ticket) => {
        acc[ticket.id] = 0;
        return acc;
    }, {});
}

// ─── Component ────────────────────────────────────────────────────────────────

function Booking() {
    const [event] = useState(MOCK_EVENT);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [ticketQuantities, setTicketQuantities] = useState({});
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                setLoading(true);

                // const result = await getBooking();
                const result = MOCK_BOOKING;

                if (result.success) {
                    setTicketTypes(result.data);
                    setTicketQuantities(buildInitialQuantities(result.data));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAPI();
    }, []);

    // ─── Derived state ──────────────────────────────────────────────────────

    const totalTickets = useMemo(
        () => getTotalTickets(ticketQuantities),
        [ticketQuantities],
    );

    const totalPrice = useMemo(() => {
        return ticketTypes.reduce((total, ticket) => {
            return total + ticket.price * (ticketQuantities[ticket.id] ?? 0);
        }, 0);
    }, [ticketTypes, ticketQuantities]);

    const selectedTicketItems = useMemo(() => {
        return ticketTypes.filter((ticket) => {
            return (ticketQuantities[ticket.id] ?? 0) > 0;
        });
    }, [ticketTypes, ticketQuantities]);

    const canContinue =
        totalTickets > 0 && selectedSeats.length === totalTickets;

    // ─── Handlers ───────────────────────────────────────────────────────────

    const handleChangeQuantity = (ticketId, action) => {
        const ticket = ticketTypes.find((item) => item.id === ticketId);

        if (!ticket || ticket.status === 'sold_out') return;

        setTicketQuantities((prevQtys) => {
            const current = prevQtys[ticketId] ?? 0;

            const next =
                action === 'increase'
                    ? current + 1
                    : Math.max(current - 1, 0);

            const nextQtys = {
                ...prevQtys,
                [ticketId]: next,
            };

            const nextTotal = getTotalTickets(nextQtys);

            // Trim selected seats nếu tổng vé giảm xuống
            setSelectedSeats((prevSeats) =>
                prevSeats.length <= nextTotal
                    ? prevSeats
                    : prevSeats.slice(0, nextTotal),
            );

            return nextQtys;
        });
    };

    const handleToggleSeat = (seatCode) => {
        if (BOOKED_SEATS.includes(seatCode)) return;

        setSelectedSeats((prevSeats) => {
            const isSelected = prevSeats.includes(seatCode);

            if (isSelected) {
                return prevSeats.filter((seat) => seat !== seatCode);
            }

            const currentTotal = getTotalTickets(ticketQuantities);

            if (prevSeats.length >= currentTotal) return prevSeats;

            return [...prevSeats, seatCode];
        });
    };

    // ─── Render helpers ─────────────────────────────────────────────────────

    const renderSeat = (seatCode) => {
        const isBooked = BOOKED_SEATS.includes(seatCode);
        const isSelected = selectedSeats.includes(seatCode);

        return (
            <button
                key={seatCode}
                type="button"
                className={cx('seat', {
                    selectedSeat: isSelected,
                    bookedSeat: isBooked,
                })}
                onClick={() => handleToggleSeat(seatCode)}
                disabled={isBooked}
                aria-label={`Ghế ${seatCode}`}
                title={seatCode}
            />
        );
    };

    // ─── Early returns ──────────────────────────────────────────────────────

    if (loading) {
        return (
            <main className={cx('wrapper')}>
                <div className={cx('container')}>
                    <p className={cx('loadingText')}>Đang tải...</p>
                </div>
            </main>
        );
    }

    // ─── JSX ────────────────────────────────────────────────────────────────

    return (
        <main className={cx('wrapper')}>
            <div className={cx('container')}>
                {/* Breadcrumb */}
                <Breadcrumb className={cx('breadcrumb')}>
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
                            <span className={cx('breadcrumbText')}>
                                Thanh toán
                            </span>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Page Header */}
                <header className={cx('pageHeader')}>
                    <h1 className={cx('title')}>{event.title}</h1>
                    <p className={cx('date')}>{event.dateText}</p>
                </header>

                <div className={cx('layout')}>
                    {/* ── Main Column ── */}
                    <div className={cx('mainColumn')}>
                        {/* Ticket Types */}
                        <section className={cx('card')}>
                            <div className={cx('cardHeader')}>
                                <h2>Chọn loại vé</h2>
                            </div>

                            <div className={cx('ticketList')}>
                                {ticketTypes.map((ticket) => {
                                    const Icon =
                                        TICKET_ICON_MAP[ticket.id] ?? FaTicketAlt;

                                    const quantity =
                                        ticketQuantities[ticket.id] ?? 0;

                                    const isSoldOut =
                                        ticket.status === 'sold_out';

                                    return (
                                        <div
                                            key={ticket.id}
                                            className={cx('ticketItem', {
                                                disabledTicket: isSoldOut,
                                            })}
                                        >
                                            <div className={cx('ticketIcon')}>
                                                <Icon />
                                            </div>

                                            <div className={cx('ticketInfo')}>
                                                <h3>{ticket.name}</h3>

                                                <p className={cx('ticketPrice')}>
                                                    {formatCurrency(ticket.price)}
                                                </p>

                                                {isSoldOut && (
                                                    <span
                                                        className={cx(
                                                            'soldOutText',
                                                        )}
                                                    >
                                                        Đã bán hết
                                                    </span>
                                                )}

                                                <span
                                                    className={cx('ticketDesc')}
                                                >
                                                    {ticket.description}
                                                </span>
                                            </div>

                                            <div
                                                className={cx(
                                                    'quantityControl',
                                                )}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleChangeQuantity(
                                                            ticket.id,
                                                            'decrease',
                                                        )
                                                    }
                                                    disabled={
                                                        isSoldOut ||
                                                        quantity === 0
                                                    }
                                                    aria-label={`Giảm ${ticket.name}`}
                                                >
                                                    <FiMinus />
                                                </button>

                                                <strong>{quantity}</strong>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleChangeQuantity(
                                                            ticket.id,
                                                            'increase',
                                                        )
                                                    }
                                                    disabled={isSoldOut}
                                                    aria-label={`Tăng ${ticket.name}`}
                                                >
                                                    <FiPlus />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Seat Map */}
                        <section className={cx('card')}>
                            <div className={cx('cardHeader', 'seatHeader')}>
                                <h2>Sơ đồ chỗ ngồi</h2>

                                <div className={cx('legend')}>
                                    <span>
                                        <i
                                            className={cx(
                                                'legendDot',
                                                'legendEmpty',
                                            )}
                                        />
                                        Trống
                                    </span>

                                    <span>
                                        <i
                                            className={cx(
                                                'legendDot',
                                                'legendSelected',
                                            )}
                                        />
                                        Đang chọn
                                    </span>

                                    <span>
                                        <i
                                            className={cx(
                                                'legendDot',
                                                'legendBooked',
                                            )}
                                        />
                                        Đã đặt
                                    </span>
                                </div>
                            </div>

                            <div className={cx('seatMap')}>
                                <div className={cx('stage')}>SÂN KHẤU</div>

                                <div className={cx('seatGroups')}>
                                    <div className={cx('seatGroup')}>
                                        {SEAT_ROWS.map((row) => (
                                            <div
                                                key={row}
                                                className={cx('seatRow')}
                                            >
                                                {LEFT_SEAT_NUMBERS.map((num) =>
                                                    renderSeat(`${row}${num}`),
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className={cx('seatGroup')}>
                                        {SEAT_ROWS.map((row) => (
                                            <div
                                                key={row}
                                                className={cx('seatRow')}
                                            >
                                                {RIGHT_SEAT_NUMBERS.map((num) =>
                                                    renderSeat(`${row}${num}`),
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* ── Summary Sidebar ── */}
                    <aside className={cx('summaryCard')}>
                        <div className={cx('summaryHeader')}>
                            <h2>Tóm tắt vé của bạn</h2>
                        </div>

                        <div className={cx('summaryBody')}>
                            <div className={cx('summaryRows')}>
                                {selectedTicketItems.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className={cx('summaryRow')}
                                    >
                                        <span>
                                            {ticket.name} x
                                            {ticketQuantities[ticket.id]}
                                        </span>

                                        <strong>
                                            {formatCurrency(
                                                ticket.price *
                                                    ticketQuantities[ticket.id],
                                            )}
                                        </strong>
                                    </div>
                                ))}

                                <div className={cx('summaryRow')}>
                                    <span>
                                        Ghế đã chọn x{selectedSeats.length}
                                    </span>

                                    <strong>
                                        {selectedSeats.join(', ') || '--'}
                                    </strong>
                                </div>
                            </div>

                            <div className={cx('divider')} />

                            <div className={cx('totalRow')}>
                                <span>Tổng cộng</span>
                                <strong>{formatCurrency(totalPrice)}</strong>
                            </div>

                            <div className={cx('timer')}>
                                <FiClock />
                                <span>
                                    Ghế của bạn được giữ trong{' '}
                                    <strong>10:00</strong>
                                </span>
                            </div>

                            <button
                                type="button"
                                className={cx('continueButton')}
                                disabled={!canContinue}
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default Booking;