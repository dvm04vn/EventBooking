import classNames from 'classnames/bind';
import styles from './EventListCard.module.scss';
import Card from '../Card';
import Image from '~/Components/Image';

const cx = classNames.bind(styles);

function EventListCard({ event, onCardClick }) {
    const {
        title = "",
        dateLabel = "",
        venue = "",
        priceText = "",
        image = "",
    } = event || {};

    const isClickable = Boolean(onCardClick);

    return (
        <Card
            className={cx("card")}
            onClick={onCardClick}
            clickable={isClickable}
            bordered
            hoverable
            rounded="lg"
            shadow="sm"
        >
            <div className={cx("thumb")}>
                <Image
                    src={image}
                    alt={title || "event image"}
                    className={cx("image")}
                    ratio="16 / 9"
                    rounded="none"
                />
            </div>

            <Card.Content className={cx("body")}>
                <Card.Title className={cx("title")}>{title}</Card.Title>

                <Card.Description className={cx("date")}>
                    {dateLabel}
                </Card.Description>

                <Card.Description className={cx("venue")}>
                    {venue}
                </Card.Description>

                <p className={cx("price")}>{priceText}</p>
            </Card.Content>
        </Card>
    );
}

export default EventListCard;