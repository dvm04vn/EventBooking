import classNames from "classnames/bind";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import styles from "./Profile.module.scss";
import images from "~/assets";
import Image from "~/components/Image";
import { useAuth } from "~/context/AuthContext";
import { getMyProfile } from "~/Services/ProfileService";

const cx = classNames.bind(styles);

function Profile() {
    const { user } = useAuth(); 
    
    const { username } = useParams(); // nếu route bạn có :username thì giữ

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let alive = true;

        const fetchProfile = async () => {
            setLoading(true);
            setError("");

            try {
                // ✅ nếu API là /auth/profile thì gọi getMyProfile() thôi
                const res = await getMyProfile(); // <-- đổi nếu cần username
                const data = res?.data ?? res;

                if (!alive) return;

                setProfileData({
                    user: data?.user ?? user,
                    profile: data?.profile ?? data?.user?.profile ?? user?.profile ?? null,
                    courses: Array.isArray(data?.courses) ? data.courses : (user?.courses ?? []),
                });
            } catch (err) {
                if (!alive) return;

                setError("Không thể tải profile từ server. Đang hiển thị dữ liệu local.");
                setProfileData({
                    user,
                    profile: user?.profile ?? null,
                    courses: user?.courses ?? [],
                });
            } finally {
                if (alive) setLoading(false);
            }
        };

        fetchProfile();
        return () => {
            alive = false;
        };
    }, [username, user]); // ✅ thêm user

    const displayName = useMemo(() => {
        const p = profileData?.profile;
        const u = profileData?.user;

        const fullName = [p?.first_name, p?.last_name].filter(Boolean).join(" ");
        return fullName || u?.displayName || u?.username || u?.name || "User";
    }, [profileData]);

    const email = profileData?.user?.email || "";
    const bio = profileData?.profile?.bio || "Chưa có bio";
    const avatar =
        profileData?.profile?.avatar ||
        profileData?.user?.avatar ||
        images.noImage;

    const courses = Array.isArray(profileData?.courses) ? profileData.courses : [];

    if (loading) {
        return (
            <div className={cx("loading-container")}>
                <div className={cx("spinner")} />
                <p>Đang tải thông tin profile...</p>
            </div>
        );
    }

    return (
        <div className={cx("wrapper")}>
            {!!error && (
                <div className={cx("error-banner")}>
                    <span>⚠️ {error}</span>
                </div>
            )}

            <div className={cx("header")}>
                <div className={cx("avatar-wrapper")}>
                    <Image className={cx("avatar")} src={avatar} alt={displayName} fallback={images.noImage} />
                </div>

                <div className={cx("info")}>
                    <h1 className={cx("display-name")}>{displayName}</h1>
                    {email && <p className={cx("email")}>{email}</p>}
                </div>
            </div>

            <div className={cx("section")}>
                <h2 className={cx("section-title")}>Giới thiệu</h2>
                <p className={cx("bio")}>{bio}</p>
            </div>

            <div className={cx("section")}>
                <h2 className={cx("section-title")}>
                    Các Khóa Học Đã Tham Gia ({courses.length})
                </h2>

                {courses.length > 0 ? (
                    <div className={cx("courses-grid")}>
                        {courses.map((course) => (
                            <Link
                                key={course._id}
                                to={course.slug ? `/course/${course.slug}` : "#"}
                                className={cx("course-card")}
                            >
                                <div className={cx("course-image-wrapper")}>
                                    <Image
                                        className={cx("course-image")}
                                        src={course.image}
                                        alt={course.courseName}
                                        fallback={images.noImage}
                                    />
                                </div>

                                <div className={cx("course-content")}>
                                    <h3 className={cx("course-name")}>{course.courseName}</h3>
                                    <p className={cx("course-description")}>
                                        {course.courseDescription}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className={cx("empty-state")}>
                        <p>Chưa tham gia khóa học nào</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
