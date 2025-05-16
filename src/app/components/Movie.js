"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../styles/Movie.module.css";

export default function Movie({
  id,
  title,
  description,
  image,
  rating,
  type = "film", // "tv" si besoin
}) {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  const maxLength = 100;
  const fallbackText = "Pas de description disponible.";
  const trimmedDescription =
    description && description.length > maxLength
      ? `${description.slice(0, maxLength)}…`
      : description || fallbackText;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      href={`/${type}/${id}`}
      className={styles.cardLink}
      aria-label={`Voir la fiche de ${title}`}
    >
      <div className={styles.vignetteWrapper}>
        <div
          ref={ref}
          className={`${styles.vignette} ${isVisible ? styles.visible : ""}`}
        >
          {image && (
            <img
              src={image}
              alt={`Affiche de ${title}`}
              className={styles.poster}
            />
          )}

          <h2 className={styles.title}>{title}</h2>

          {typeof rating === "number" && (
            <p className={styles.rating}>⭐ {rating.toFixed(1)}</p>
          )}

          <p className={styles.description}>{trimmedDescription}</p>
        </div>
      </div>
    </Link>
  );
}
