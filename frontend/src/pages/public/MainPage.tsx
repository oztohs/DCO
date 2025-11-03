import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../assets/scss/etc/MainPage.module.scss';

import fullscreenBlack from '../../assets/img/Fullscreen_black.png';
import fullscreen from '../../assets/img/Fullscreen.png';
import screennoise from "../../assets/img/screennoise.png";
import screennoise1 from "../../assets/img/screennoise_1.png";
import screennoise2 from "../../assets/img/screennoise2.png";
import screennoise3 from "../../assets/img/screennoise3.png";
import screennoise4 from "../../assets/img/screennoise4.png";

interface MainPageProps {
  intervalMs?: number;   // 프레임 전환 간격(ms)
  className?: string;    // 외부 스타일 오버라이드
}

const MainPage: React.FC<MainPageProps> = ({
  intervalMs = 120,
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const images = [
    fullscreenBlack,
    fullscreen,
    screennoise,
    screennoise1,
    screennoise2,
    screennoise3,
    screennoise4,
  ];

  const [currentImage, setCurrentImage] = useState(images[0]);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  const handleTransition = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      navigate('/manual');
    }, 400);
  };

  // 클릭 또는 키 입력 시 다음 화면으로
  useEffect(() => {
    const handleKeyPress = () => handleTransition();
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // 🎞️ 빠른 노이즈 프레임 루프 (랜덤 섞기)
  useEffect(() => {
    const frameTimer = setInterval(() => {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      setCurrentImage(randomImage);
      setGlitchIntensity(Math.random() * 0.7 + 0.3); // 랜덤 강도 (0.3~1.0)
    }, intervalMs);
    return () => clearInterval(frameTimer);
  }, [intervalMs]);

  // 로그인에서 진입 시 자동 전환
  useEffect(() => {
    if (location.state?.fromLogin) {
      setTimeout(() => handleTransition(), 5000);
    }
  }, [location.state]);

  const handleClick = () => handleTransition();

  const style = {
    backgroundImage: `url(${currentImage})`,
    filter: `contrast(${1 + glitchIntensity * 0.3}) brightness(${1 + glitchIntensity * 0.2})`,
  };

  return (
    <div
      ref={containerRef}
      style={style}
      onClick={handleClick}
      className={`
        ${styles.glitch}
        ${className}
        ${isFadingOut ? styles.fadeOut : ''}
      `}
    >
      {/* RGB 채널 왜곡 */}
      <div className={`${styles.channel} ${styles.r}`} style={{ opacity: 0.3 + glitchIntensity * 0.5 }}></div>
      <div className={`${styles.channel} ${styles.g}`} style={{ opacity: 0.3 + glitchIntensity * 0.5 }}></div>
      <div className={`${styles.channel} ${styles.b}`} style={{ opacity: 0.3 + glitchIntensity * 0.5 }}></div>

      {/* 스크린 노이즈 */}
      <div className={styles.noise} style={{ opacity: 0.2 + glitchIntensity * 0.6 }}></div>
    </div>
  );
};

export default MainPage;
