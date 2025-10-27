import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/etc/loading.module.scss";

import img1 from "../../assets/img/Fullscreen_black.png";
import img2 from "../../assets/img/Fullscreen.png";
import img3 from "../../assets/img/screennoise.png";
import img4 from "../../assets/img/screennoise1.png";
import img5 from "../../assets/img/screennoise2.png";
import img6 from "../../assets/img/screennoise3.png";
import img7 from "../../assets/img/screennoise4.png";

const images = [img1, img2, img3, img4, img5, img6, img7];

const Loading: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 120); // 프레임 전환 속도 (0.12초 간격)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.loadingContainer}>
      <img src={images[index]} alt="glitch" className={styles.bgImage} />
      <div className={styles.glitchText}>
        <h1>HACK</h1>
        <p>THIS OUT 2.0</p>
      </div>
    </div>
  );
};

export default Loading;
