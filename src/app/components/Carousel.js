"use client";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/Carousel.module.css";

export default function Carousel({ items, autoPlay = true, delay = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  // Stoppe le timer si existant
  const clearAutoPlay = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Gère le passage automatique à l'image suivante
  const startAutoPlay = () => {
    clearAutoPlay();
    timeoutRef.current = setTimeout(() => {
      goToNext();
    }, delay);
  };

  useEffect(() => {
    if (autoPlay) {
      startAutoPlay();
    }
    return clearAutoPlay;
  }, [currentIndex, autoPlay, delay]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className={styles.carousel}
      onMouseEnter={clearAutoPlay}
      onMouseLeave={() => autoPlay && startAutoPlay()}
    >
      <div
        className={styles.inner}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div
            className={styles.item}
            key={index}
            aria-hidden={index !== currentIndex}
          >
            {item}
          </div>
        ))}
      </div>

      <button
        className={`${styles.btn} ${styles.prev}`}
        onClick={goToPrev}
        aria-label="Image précédente"
      >
        ‹
      </button>

      <button
        className={`${styles.btn} ${styles.next}`}
        onClick={goToNext}
        aria-label="Image suivante"
      >
        ›
      </button>
    </div>
  );
}
