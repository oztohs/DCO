import React, { useEffect, useRef, useState } from 'react';
import styles from '../../assets/scss/etc/loading.module.scss';
import hackText from '../../assets/img/Fullscreen_black.png';
import hackLogo from '../../assets/img/Fullscreen_nobg.png';
import hackFull from '../../assets/img/Fullscreen.png';

const images = [hackText, hackLogo, hackFull];

const Loading: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPreGlitch, setIsPreGlitch] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // === 1️⃣ 주기적으로 글리치 전환 ===
    const intervalId = setInterval(() => {
      setIsPreGlitch(true); // 프리글리치 시작

      setTimeout(() => {
        setIsPreGlitch(false);
        setIsTransitioning(true);

        setTimeout(() => {
          // 다음 이미지로 전환
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
          setIsTransitioning(false);
        }, 500);
      }, 350);
    }, 5000);

    // === 2️⃣ 마지막 단계 후 페이드아웃 ===
    const fadeTimer = setTimeout(() => setFadeOut(true), 16000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(fadeTimer);
    };
  }, []);

  const currentImage = images[currentImageIndex];
  const style = {
    backgroundImage: `url(${currentImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  return (
    <div
      ref={containerRef}
      style={style}
      className={`
        ${styles.glitch}
        ${isTransitioning ? styles.transitioning : ''}
        ${isPreGlitch ? styles.preGlitch : ''}
        ${fadeOut ? styles.fadeOut : ''}
      `}
    >
      {/* RGB 채널 */}
      <div className={`${styles.channel} ${styles.r}`}></div>
      <div className={`${styles.channel} ${styles.g}`}></div>
      <div className={`${styles.channel} ${styles.b}`}></div>
      <div className={styles.noise}></div>

      {/* 중앙 글씨 (이미지와 중첩돼도 자연스러움) */}
      <div className={styles.introText}>
        <span className={styles.hack}>HACK</span>
        <span className={styles.thisOut}>THIS OUT 2.0</span>
      </div>
    </div>
  );
};

export default Loading;
