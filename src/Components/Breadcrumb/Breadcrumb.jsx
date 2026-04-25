import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Breadcrumb.module.scss";

const cx = classNames.bind(styles);

function Breadcrumb({ children, className }) {
  return (
    <nav className={cx("breadcrumb", className)} aria-label="breadcrumb">
      {children}
    </nav>
  );
}

function BreadcrumbList({ children, className }) {
  return <ol className={cx("list", className)}>{children}</ol>;
}

function BreadcrumbItem({ children, className }) {
  return <li className={cx("item", className)}>{children}</li>;
}

function BreadcrumbLink({ to, children, className }) {
  return (
    <Link to={to} className={cx("link", className)}>
      {children}
    </Link>
  );
}

function BreadcrumbPage({ children, className }) {
  return (
    <span className={cx("page", className)} aria-current="page">
      {children}
    </span>
  );
}

function BreadcrumbSeparator({ children, className }) {
  return <span className={cx("separator", className)}>{children || "/"}</span>;
}

function BreadcrumbEllipsis({ className }) {
  return <span className={cx("ellipsis", className)}>...</span>;
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};