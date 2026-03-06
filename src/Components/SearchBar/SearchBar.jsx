import React from "react";
import classNames from "classnames/bind";
import { IoIosSearch } from "react-icons/io";

import styles from "./SearchBar.module.scss";
import Button from "~/Components/Button";
import Input from "~/Components/Input";

const cx = classNames.bind(styles);

function SearchBar({
    value,
    onChange,
    onSearch,
    placeholder = "Tìm kiếm tên sự kiện, nghệ sĩ, địa điểm...",
    ariaLabel = "Tìm kiếm",
    id = "global-search-input",
    allowEmptySearch = false,
    isLoading = false,
    className,
}) {
    const descriptionId = `${id}-description`;
    const safeValue = value ?? "";

    const handleInputChange = (event) => {
        onChange(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const trimmed = safeValue.trim();
        if (!allowEmptySearch && !trimmed) return;

        const queryToUse = allowEmptySearch ? safeValue : trimmed;
        onSearch(queryToUse);
    };



    return (
        <form
            className={cx("wrapper", className)}
            onSubmit={handleSubmit}
            role="search"
            aria-label={ariaLabel}
        >
            <label htmlFor={id} className={cx("visuallyHidden")}>
                Từ khóa tìm kiếm (tên sự kiện, nghệ sĩ hoặc địa điểm tổ chức)
            </label>

            <div className={cx("inputWrapper")}>
                <div className={cx("inputArea")}>
                    <Input
                        id={id}
                        type="search"
                        value={safeValue}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        // style wrapper riêng cho SearchBar, nếu bạn muốn khác với Input mặc định
                        wrapperClassName={cx("inputRoot")}
                        // style thêm trực tiếp cho <input>
                        className={cx("input")}
                        aria-describedby={descriptionId}
                    />
                    <span id={descriptionId} className={cx("visuallyHidden")}>
                        Bạn có thể tìm theo tên sự kiện, tên nghệ sĩ hoặc địa điểm tổ chức
                    </span>
                </div>
                <Button
                    type="submit"
                    className={cx("button")}
                    disabled={isLoading}
                >
                    <IoIosSearch
                        className={cx("icon")}
                        aria-hidden="true"
                        focusable="false"
                    />
                    <span className={cx("buttonText")}>
                        {isLoading ? "Đang tìm..." : "Tìm kiếm"}
                    </span>
                </Button>
            </div>
        </form>
    );
}

export default React.memo(SearchBar);
