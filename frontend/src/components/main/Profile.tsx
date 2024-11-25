import React, { useContext, useRef, useEffect } from 'react';
import { logoutUser } from '../../api/axiosUser';
import { useNavigate } from 'react-router-dom';
import { AuthUserContext } from '../../contexts/AuthUserContext';
import styles from '../../assets/scss/section/_profile.module.scss';
import { useProfileContext } from '../../contexts/ProfileContext';
import { FaArrowRightToBracket } from "react-icons/fa6";
import down_arrow from '../../assets/img/icon/down_arrow.svg';
import up_arrow from '../../assets/img/icon/up_arrow.svg';
import setting from '../../assets/img/icon/setting_icon.svg';
import darkmode_icon from '../../assets/img/icon/darkmode_icon.svg';
import darkmode_switch from '../../assets/img/icon/darkmode_switch.svg';
import { Avatar } from '@mui/material';
import { avatarBackgroundColors, getAvatarColorIndex } from '../../utils/avatars';

import { FaRegUserCircle } from "react-icons/fa";
import { IoStatsChartOutline } from "react-icons/io5";
interface MenuItemProps {
    onClick?: () => void;
    children: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, children }) => (
    <div onClick={onClick}>{children}</div>
);

const Profile: React.FC = () => {
    const { isProfileCollapsed, toggleProfile } = useProfileContext();
    const navigate = useNavigate();
    const authUserContext = useContext(AuthUserContext);
    const dropdownRef = useRef<HTMLDivElement>(null);

    if (!authUserContext) {
        throw new Error('AuthUserContext must be used within an AuthUserProvider');
    }

    const { currentUser, logout } = authUserContext;

    const handleLogout = async () => {
        try {
            await logoutUser();
            logout();
            navigate('/login');
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Logout failed:', error.message);
                // Optionally, show an error message to the user
            }
        }
    };

    const handleMenuItemClick = (action: () => void) => {
        action();
        toggleProfile();
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            if (!isProfileCollapsed) {
                toggleProfile();
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileCollapsed]);

    const avatarColorIndex = getAvatarColorIndex(currentUser?.username || '');
    const avatarBgColor = avatarBackgroundColors[avatarColorIndex];

    return (
        <div className={styles.userinfoDark} ref={dropdownRef}>
            <div className={styles.userinfoDark_container}>
                <div className={styles.userinfo}>
                    <div className={styles.rectangleParent}>
                        <Avatar
                            sx={{
                                backgroundColor: avatarBgColor, width: 50, height: 50, fontSize: '1.5rem'
                            }}
                        >
                            {currentUser?.username?.charAt(0).toUpperCase() || ''}
                        </Avatar>
                        <div className={styles.userinfoContainer}>
                            <div className={styles.userName}>{currentUser?.username || 'Guest'}</div>
                            <div className={styles.userEmail}>{currentUser?.email || 'Guest'}</div>
                        </div>
                    </div>
                    <div onClick={toggleProfile}>
                        <img className={styles.userinfoButtonIcon} alt="" src={isProfileCollapsed ? down_arrow : up_arrow} />
                    </div>
                </div>
            </div>
            <div className={`${styles.userMenu} ${isProfileCollapsed ? styles.collapsed : ''}`}>
                <li className={styles.settings}>
                    <div className={styles.settingsInner}>
                        <div className={styles.rectangleParent}>
                            <FaRegUserCircle className={styles.icon} />
                            <MenuItem onClick={() => handleMenuItemClick(() => navigate('/mypage'))}>My Profile</MenuItem>
                        </div>
                    </div>
                    <div className={styles.settingsInner}>
                        <div className={styles.rectangleParent}>
                            <IoStatsChartOutline className={styles.icon} />
                            <MenuItem onClick={() => handleMenuItemClick(() => navigate('/mystats'))}>My Stats</MenuItem>
                        </div>
                    </div>
                    <div className={styles.settingsInner}>
                        <div className={styles.rectangleParent}>
                            <img className={styles.icon} alt="" src={setting} />
                            <MenuItem onClick={() => handleMenuItemClick(() => navigate('/settings'))}>Settings</MenuItem>
                        </div>
                    </div>
                    <div className={styles.settingsInner}>
                        <div className={styles.rectangleParent}>
                            <img className={styles.icon} alt="" src={darkmode_icon} />
                            <div className={styles.darkModeParent}>
                                <div className={styles.darkMode}>Dark mode</div>
                            </div>
                        </div>
                        <img className={styles.switchIcon} alt="" src={darkmode_switch} />
                    </div>
                </li>
                <div className={styles.userinfoDarkChild} />
                <div className={styles.logout}>
                    <FaArrowRightToBracket className={styles.logout_icon} size={30} />
                    <MenuItem onClick={() => handleMenuItemClick(handleLogout)}>Logout</MenuItem>
                </div>
            </div>
        </div >
    );
};

export default Profile;