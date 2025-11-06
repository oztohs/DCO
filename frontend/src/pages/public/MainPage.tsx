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
  intervalMs?: number;   // 노이즈 프레임 전환 간격(ms)
  className?: string;
}

const MainPage: React.FC<MainPageProps> = ({
  intervalMs = 80, // 지지직 프레임 간격 (빠를수록 격함)
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const noiseFrames = [screennoise, screennoise1, screennoise2, screennoise3, screennoise4];
  const [currentImage, setCurrentImage] = useState(fullscreenBlack);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleTransition = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      navigate('/manual');
    }, 400);
  };

  // 클릭 / 키 입력 시 수동 전환
  useEffect(() => {
    const handleKeyPress = () => handleTransition();
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // ⚙️ 전체 루프 시퀀스 (Fullscreen ↔ Noise 반복)
  useEffect(() => {
    let phase = 0; // 0: fullscreen, 1: noise
    let noiseIndex = 0;
    let mainTimer: NodeJS.Timeout;
    let noiseInterval: NodeJS.Timeout;

    const startLoop = () => {
      // 🔹 Step 1️⃣: 처음은 fullscreenBlack → fullscreen 전환
      if (phase === 0) {
        setCurrentImage(fullscreenBlack);
        setTimeout(() => setCurrentImage(fullscreen), 300); // 부드러운 페이드
      }

      // 🔹 Step 2️⃣: 2초 유지 후 노이즈 시작
      mainTimer = setTimeout(() => {
        phase = 1;
        noiseInterval = setInterval(() => {
          // 지지직 노이즈 프레임 순환
          setCurrentImage(noiseFrames[noiseIndex % noiseFrames.length]);
          setGlitchIntensity(Math.random() * 0.6 + 0.4);
          noiseIndex++;
        }, intervalMs);

        // 🔹 Step 3️⃣: 1초 동안 지지직 후 다시 fullscreen 복귀
        setTimeout(() => {
          clearInterval(noiseInterval);
          setCurrentImage(fullscreen);
          setGlitchIntensity(0);
          phase = 0;
          // 🔁 다시 루프 시작 (2초 후 재귀)
          setTimeout(startLoop, 2000);
        }, 1000);
      }, 2000);
    };

    startLoop();

    return () => {
      clearTimeout(mainTimer);
      clearInterval(noiseInterval);
    };
  }, [intervalMs]);

  // 로그인 진입 시 자동 전환
  useEffect(() => {
    if (location.state?.fromLogin) {
      const timer = setTimeout(() => handleTransition(), 6000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleClick = () => handleTransition();

  const style = {
    backgroundImage: `url(${currentImage})`,
    filter: `contrast(${1 + glitchIntensity * 0.3}) brightness(${1 + glitchIntensity * 0.2})`,
    transition: 'background-image 0.15s ease-in-out, filter 0.1s ease-in-out',
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

      {/* 스크린 노이즈 오버레이 */}
      <div className={styles.noise} style={{ opacity: 0.2 + glitchIntensity * 0.6 }}></div>
    </div>
  );
};

export default MainPage;
