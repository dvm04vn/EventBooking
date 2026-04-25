import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

const cx = classNames.bind(styles);

function Modal({
    isOpen = false,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    className,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    showCloseButton = true,
}) {
    useEffect(() => {
        if (!isOpen) return undefined;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !closeOnEsc) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, closeOnEsc, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (event) => {
        if (!closeOnOverlayClick) return;
        if (event.target === event.currentTarget) {
            onClose?.();
        }
    };

    const modalContent = (
        <div className={cx('overlay')} onClick={handleOverlayClick}>
            <div
                className={cx('modal', `size-${size}`, className)}
                role="dialog"
                aria-modal="true"
                aria-hidden={!isOpen}
            >
                {(title || showCloseButton) && (
                    <div className={cx('header')}>
                        {title ? <h3 className={cx('title')}>{title}</h3> : <div />}

                        {showCloseButton && (
                            <button
                                type="button"
                                className={cx('closeButton')}
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}

                <div className={cx('body')}>{children}</div>

                {footer && <div className={cx('footer')}>{footer}</div>}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

export default Modal;