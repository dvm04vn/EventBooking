import { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import images from '~/assets';
import styles from './Image.module.scss';

const cx = classNames.bind(styles);

const Image = forwardRef(
    (
        {
            src,
            alt = '',
            className,
            imgClassName,
            fallback = images.noImage,
            rounded = 'md',
            fit = 'cover',
            ratio,
            width,
            height,
            loading = 'lazy',
            onClick,
            ...passProps
        },
        ref,
    ) => {
        const [imageSrc, setImageSrc] = useState(src || fallback);

        useEffect(() => {
            setImageSrc(src || fallback);
        }, [src, fallback]);

        const handleError = () => {
            if (imageSrc === fallback) return;
            setImageSrc(fallback);
        };

        const handleKeyDown = (event) => {
            if (!onClick) return;

            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick(event);
            }
        };

        const wrapperStyle = {
            ...(ratio ? { aspectRatio: ratio } : {}),
            ...(width ? { width } : {}),
            ...(height ? { height } : {}),
        };

        const wrapperClassName = cx('wrapper', className, {
            [`rounded-${rounded}`]: rounded,
            clickable: Boolean(onClick),
        });

        const imageClassName = cx('image', imgClassName, {
            [`fit-${fit}`]: fit,
        });

        return (
            <div
                className={wrapperClassName}
                style={wrapperStyle}
                onClick={onClick}
                role={onClick ? 'button' : undefined}
                tabIndex={onClick ? 0 : undefined}
                onKeyDown={handleKeyDown}
            >
                <img
                    ref={ref}
                    className={imageClassName}
                    src={imageSrc}
                    alt={alt}
                    onError={handleError}
                    loading={loading}
                    {...passProps}
                />
            </div>
        );
    },
);

export default Image;