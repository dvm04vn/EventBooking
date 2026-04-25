import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import styles from "./BannerHome.module.scss";
import images from "~/assets";

const cx = classNames.bind(styles);

function BannerHome() {
    const navigate = useNavigate();

    const handleViewEvents = () => {
        navigate("/events");
    };

    return (
        <section
            className={cx("wrapper")}
            style={{ backgroundImage: `url(${images.BannerHome || images.BannerHome})` }}
        >
            <div className={cx("overlay")} />

            <div className={cx("content")}>
                <h1 className={cx("title")}>Khám Phá Những Sự Kiện Đỉnh Cao</h1>
                <p className={cx("description")}>
                    Tìm và đặt vé cho hàng ngàn concert, lễ hội, và sự kiện văn hóa độc đáo.
                </p>

                <button
                    type="button"
                    className={cx("view-events-btn")}
                    onClick={handleViewEvents}
                >
                    Xem Sự Kiện
                </button>
            </div>
        </section>
    );
}

export default BannerHome;