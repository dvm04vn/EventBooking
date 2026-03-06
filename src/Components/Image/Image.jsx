import React, { forwardRef, useCallback, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Image.module.scss";

const cx = classNames.bind(styles);


const Image = forwardRef(({
    src,
    alt,
    sources,
    srcSet,
    sizes,
    lazy = true,
    decoding = "async",
    fetchPriority = "auto",
    placeholderSrc,
    fallbackSrc,
    ratio,
    width,
    height,
    fit = "cover",
    objectPosition,
    rounded = false,
    bordered = false,
    skeleton = true,
    className,
    wrapperClassName,
    style,
    onLoad,
    onError,

    ...rest
}, ref) => {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);

    const finalSrc = errored && fallbackSrc ? fallbackSrc : src;
    const showPlaceholder = !!placeholderSrc && !loaded && !errored;

    const handleLoad = useCallback((e) => {
        setLoaded(true);
        onLoad?.(e);
    }, [onLoad]);

    const handleError = useCallback((e) => {
        if (!errored && fallbackSrc && finalSrc !== fallbackSrc) {
            setErrored(true);
            return;
        }
        onError?.(e);
    }, [errored, fallbackSrc, finalSrc, onError]);

    const wrapperStyles = useMemo(() => {
        const s = { ...style };
        if (ratio) {
            s.aspectRatio = String(ratio);
            if (s.width == null) s.width = "100%";
        }
        return s;
    }, [ratio, style]);

    const imgClass = cx(
        "img",
        `fit-${fit}`,
        { rounded, bordered, transparent: showPlaceholder },
        className
    );

    const imgStyle = objectPosition ? { objectPosition } : undefined;

    const imgProps = {
        ref,
        src: finalSrc,
        alt,
        className: imgClass,
        style: imgStyle,
        loading: lazy ? "lazy" : undefined,
        fetchpriority: fetchPriority,
        decoding,
        srcSet,
        sizes,
        width,
        height,
        onLoad: handleLoad,
        onError: handleError,
        ...rest,
    };

    return (
        <div
            className={cx("wrapper", { rounded, bordered }, wrapperClassName)}
            style={wrapperStyles}
        >
            {showPlaceholder && (
                <img
                    src={placeholderSrc}
                    alt=""
                    aria-hidden="true"
                    className={cx("placeholder", { rounded })}
                />
            )}

            {skeleton && !loaded && !errored && (
                <div aria-hidden="true" className={cx("skeleton", { rounded })} />
            )}

            {Array.isArray(sources) && sources.length > 0 ? (
                <picture>
                    {sources.map((s, i) => (
                        <source key={i} type={s.type} media={s.media} srcSet={s.srcSet} sizes={s.sizes} />
                    ))}
                    <img {...imgProps} />
                </picture>
            ) : (
                <img {...imgProps} />
            )}
        </div>
    );
});

export default Image;
