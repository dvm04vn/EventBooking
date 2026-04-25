import classNames from "classnames/bind";
import styles from "./About.module.scss";
import images from "~/assets";

const cx = classNames.bind(styles);

const FEATURES = [
    {
        id: 1,
        title: "Khám phá sự kiện dễ dàng",
        description:
            "Tìm kiếm nhanh các concert, lễ hội, hội thảo và sự kiện văn hóa hấp dẫn trên toàn quốc.",
    },
    {
        id: 2,
        title: "Đặt vé nhanh chóng",
        description:
            "Quy trình đặt vé đơn giản, trực quan và tiết kiệm thời gian cho mọi người dùng.",
    },
    {
        id: 3,
        title: "Thông tin minh bạch",
        description:
            "Cập nhật đầy đủ thời gian, địa điểm, nghệ sĩ, lịch trình và các loại vé cho từng sự kiện.",
    },
    {
        id: 4,
        title: "Trải nghiệm hiện đại",
        description:
            "Giao diện tối ưu, dễ sử dụng trên cả desktop lẫn mobile, phù hợp với mọi đối tượng.",
    },
];

const STATS = [
    { id: 1, value: "10K+", label: "Người dùng hoạt động" },
    { id: 2, value: "500+", label: "Sự kiện đã đăng tải" },
    { id: 3, value: "50+", label: "Đối tác tổ chức" },
    { id: 4, value: "99%", label: "Mức độ hài lòng" },
];

function About() {
    const heroImage = images?.backgroundImage || images?.event || "";

    return (
        <main className={cx("wrapper")}>
            <section className={cx("hero")}>
                <div
                    className={cx("heroBg")}
                    style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
                    aria-hidden="true"
                />
                <div className={cx("heroOverlay")} aria-hidden="true" />

                <div className={cx("container")}>
                    <div className={cx("heroContent")}>
                        <span className={cx("eyebrow")}>Về chúng tôi</span>
                        <h1 className={cx("heroTitle")}>Nền tảng kết nối bạn với những sự kiện đáng nhớ</h1>
                        <p className={cx("heroDesc")}>
                            Chúng tôi xây dựng Event Booking để giúp mọi người dễ dàng khám phá,
                            theo dõi và đặt vé các sự kiện yêu thích một cách nhanh chóng,
                            hiện đại và đáng tin cậy.
                        </p>
                    </div>
                </div>
            </section>

            <section className={cx("introSection")}>
                <div className={cx("container", "introGrid")}>
                    <div className={cx("introContent")}>
                        <h2 className={cx("sectionTitle")}>Chúng tôi là ai?</h2>
                        <p className={cx("paragraph")}>
                            Event Booking là nền tảng hỗ trợ người dùng tìm kiếm và đặt vé cho
                            các sự kiện giải trí, nghệ thuật, thể thao, hội thảo và nhiều hoạt
                            động nổi bật khác. Chúng tôi mong muốn tạo ra một trải nghiệm đặt vé
                            đơn giản, trực quan và thân thiện.
                        </p>
                        <p className={cx("paragraph")}>
                            Không chỉ là nơi bán vé, chúng tôi còn là cầu nối giữa khán giả,
                            nghệ sĩ và ban tổ chức, giúp mọi sự kiện tiếp cận đúng đối tượng và
                            mang lại trải nghiệm tốt hơn cho cộng đồng.
                        </p>
                    </div>

                    <div className={cx("introCard")}>
                        <h3 className={cx("cardTitle")}>Sứ mệnh của chúng tôi</h3>
                        <p className={cx("cardDesc")}>
                            Mang những sự kiện chất lượng đến gần hơn với mọi người thông qua
                            một nền tảng công nghệ hiện đại, dễ sử dụng và đáng tin cậy.
                        </p>

                        <h3 className={cx("cardTitle")}>Tầm nhìn</h3>
                        <p className={cx("cardDesc")}>
                            Trở thành nền tảng đặt vé và khám phá sự kiện hàng đầu tại Việt Nam,
                            đồng hành cùng cộng đồng yêu văn hóa, nghệ thuật và giải trí.
                        </p>
                    </div>
                </div>
            </section>

            <section className={cx("featureSection")}>
                <div className={cx("container")}>
                    <h2 className={cx("sectionTitle", "center")}>Điều gì làm chúng tôi khác biệt?</h2>

                    <div className={cx("featureGrid")}>
                        {FEATURES.map((item) => (
                            <article key={item.id} className={cx("featureCard")}>
                                <div className={cx("featureIcon")}>{item.id}</div>
                                <h3 className={cx("featureTitle")}>{item.title}</h3>
                                <p className={cx("featureDesc")}>{item.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className={cx("statsSection")}>
                <div className={cx("container")}>
                    <div className={cx("statsGrid")}>
                        {STATS.map((item) => (
                            <div key={item.id} className={cx("statCard")}>
                                <h3 className={cx("statValue")}>{item.value}</h3>
                                <p className={cx("statLabel")}>{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={cx("teamSection")}>
                <div className={cx("container")}>
                    <h2 className={cx("sectionTitle")}>Đội ngũ của chúng tôi</h2>
                    <p className={cx("paragraph", "teamText")}>
                        Chúng tôi là những người yêu công nghệ, yêu sự kiện và luôn mong muốn
                        tạo ra sản phẩm giúp kết nối con người với những trải nghiệm ý nghĩa.
                        Mỗi tính năng được xây dựng đều hướng đến sự tiện lợi, rõ ràng và thân thiện.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default About;