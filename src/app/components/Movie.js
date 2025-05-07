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
  type = "film", // Par défaut : film
}) {
  console.log("🎯 Movie rendu client :", {
    id,
    title,
    description,
    image,
    rating,
    type,
  });
  console.log("🔍 Movie rendu :", { id, title, type });
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  // Description propre + raccourcie
  const maxLength = 100;
  const cleanDescription = description || "Pas de description disponible";
  const shortDescription =
    cleanDescription.length > maxLength
      ? cleanDescription.slice(0, maxLength) + "…"
      : cleanDescription;

  // Animation apparition
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Link href={`/${type}/${id}`} className={styles.cardLink}>
      <div className={styles.vignetteWrapper}>
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
