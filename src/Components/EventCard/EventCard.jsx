import classNames from "classnames/bind";
import styles from "./EventCard.module.scss";
import Card from "../Card";
import Image from "~/Components/Image";
import Button from "~/Components/Button";

const cx = classNames.bind(styles);

function EventCard({ event, onCardClick }) {
    const {
        title = "",
        location = "",
        image = "",
        date,
        month,
        dateTag = "",
    } = event || {};

    const handleBookClick = () => {
        onCardClick?.(event);
    };

    const dayText = dateTag || (date && month ? `${date} Thg ${month}` : "");

    return (
        <Card className={cx("card")}>
            <div className={cx("thumb")}>
                <Image
                    src={image}
                    alt={title}
                    className={cx("image-wrapper")}
                    imgClassName={cx("image")}
                    ratio="16 / 10"
                    rounded="none"
                />

                {dayText && <div className={cx("badge")}>{dayText}</div>}
            </div>

            <Card.Content className={cx("body")}>
                <Card.Title className={cx("title")}>{title}</Card.Title>

                <Card.Description className={cx("location")}>
                    {location}
                </Card.Description>
            </Card.Content>

            <Card.Footer className={cx("footer")}>
                <div className={cx('button')}>
                    <Button
                        primary
                        type="button"
                        className={cx("button")}
                        onClick={handleBookClick}
                    >
                        Đặt vé
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    );
}

export default EventCard;