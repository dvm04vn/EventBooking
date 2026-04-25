import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
// import { getProfileid } from '~/Services/profile.service';

const cx = classNames.bind(styles);

export const MOCK_USER = {
    success: true,
    message: 'Lấy thông tin profile thành công',
    data: {
        id: 'usr_1024',
        username: 'nguyenvana',
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        phone: '0987654321',
        avatar: 'https://i.pravatar.cc/300?img=12',
        coverPhoto: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        bio: 'Frontend Developer | ReactJS | NodeJS',
        gender: 'male',
        dateOfBirth: '1999-08-15',
        address: {
            street: '12 Nguyễn Trãi',
            ward: 'Phường Bến Thành',
            district: 'Quận 1',
            city: 'Hồ Chí Minh',
        },
        socials: {
            facebook: 'https://facebook.com/nguyenvana',
            github: 'https://github.com/nguyenvana',
            linkedin: 'https://linkedin.com/in/nguyenvana',
        },
        stats: {
            followers: 1250,
            following: 320,
            posts: 48,
        },
        role: 'user',
        isVerified: true,
        createdAt: '2024-01-10T08:30:00.000Z',
        updatedAt: '2026-04-13T10:15:00.000Z',
    },
};

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // const res = await getProfileid();
                const res = MOCK_USER;

                if (res.success) {
                    setUser(res.data);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUser();
    }, []);

    if (!user) {
        return <div className={cx('wrapper')}>Loading...</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('cover')}>
                <img src={user.coverPhoto} alt="cover" className={cx('cover-img')} />
            </div>

            <div className={cx('content')}>
                <div className={cx('avatar-box')}>
                    <img src={user.avatar} alt={user.fullName} className={cx('avatar')} />
                </div>

                <div className={cx('info')}>
                    <h2 className={cx('name')}>
                        {user.fullName}
                        {user.isVerified && <span className={cx('verified')}>✔</span>}
                    </h2>

                    <p className={cx('username')}>@{user.username}</p>
                    <p className={cx('bio')}>{user.bio}</p>

                    <div className={cx('detail-list')}>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Số điện thoại:</strong> {user.phone}</p>
                        <p><strong>Giới tính:</strong> {user.gender}</p>
                        <p><strong>Ngày sinh:</strong> {user.dateOfBirth}</p>
                        <p>
                            <strong>Địa chỉ:</strong> {user.address.street}, {user.address.ward},{' '}
                            {user.address.district}, {user.address.city}
                        </p>
                        <p><strong>Vai trò:</strong> {user.role}</p>
                    </div>

                    <div className={cx('stats')}>
                        <div className={cx('stat-item')}>
                            <strong>{user.stats.followers}</strong>
                            <span>Followers</span>
                        </div>
                        <div className={cx('stat-item')}>
                            <strong>{user.stats.following}</strong>
                            <span>Following</span>
                        </div>
                        <div className={cx('stat-item')}>
                            <strong>{user.stats.posts}</strong>
                            <span>Posts</span>
                        </div>
                    </div>

                    <div className={cx('socials')}>
                        <a href={user.socials.facebook} target="_blank" rel="noreferrer">
                            Facebook
                        </a>
                        <a href={user.socials.github} target="_blank" rel="noreferrer">
                            GitHub
                        </a>
                        <a href={user.socials.linkedin} target="_blank" rel="noreferrer">
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;