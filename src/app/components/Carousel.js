"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Carousel.module.css";

export default function Carousel({ items, autoPlay = true, delay = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      resetTimeout();
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
      }, delay);
    }
    return () => {
      resetTimeout();
    };
  }, [currentIndex, items.length, delay, autoPlay]);

  const handlePrev = () => {
    setCurrentIndex(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div
      className={styles.carousel}
      onMouseEnter={resetTimeout}
      onMouseLeave={() => {
        if (autoPlay) {
          timeoutRef.current = setTimeout(handleNext, delay);
        }
      }}
    >
      <div
        className={styles.inner}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div className={styles.item} key={index}>
            {item}
          </div>
        ))}
      </div>
      <button className={`${styles.btn} ${styles.prev}`} onClick={handlePrev}>
        ‹
      </button>
      <button className={`${styles.btn} ${styles.next}`} onClick={handleNext}>
        ›
      </button>
    </div>
  );
}
