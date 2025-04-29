"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../styles/Movie.module.css";

export default function Movie({ id, title, description, image, rating }) {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  const maxLength = 100;
  const shortDescription =
    description.length > maxLength
      ? description.slice(0, maxLength) + "…"
      : description;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Link href={`/film/${id}`} className={styles.cardLink}>
      <div className={`${styles.vignetteWrapper}`}>
        <div
          ref={ref}
          className={`${styles.vignette} ${isVisible ? styles.visible : ""}`}
        >
          {image && <img src={image} alt={title} className={styles.poster} />}
          <h2>{title}</h2>
          {typeof rating === "number" && (
            <p className={styles.rating}>⭐ {rating.toFixed(1)}</p>
          )}
          <p>{shortDescription}</p>
        </div>
      </div>
    </Link>
  );
}
