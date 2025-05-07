"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../../styles/FilmDetail.module.css";

export default function SerieDetail() {
  const params = useParams();
  const [serie, setSerie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  useEffect(() => {
    if (!params?.id) return;

    async function fetchSerie() {
      try {
        const res = await fetch(`/api/series/${params.id}`);
        const data = await res.json();
        setSerie(data);

        const videoRes = await fetch(`/api/series/${params.id}/videos`);
        const videoData = await videoRes.json();
        const trailer = videoData.results?.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );
        if (trailer) setTrailerKey(trailer.key);

        const savedRating = localStorage.getItem(`rating-serie-${params.id}`);
        if (savedRating) setRating(parseInt(savedRating));
      } catch (error) {
        console.error("Erreur chargement série :", error);
      }
    }

    fetchSerie();
  }, [params?.id]);

  const handleRate = (value) => {
    setRating(value);
    localStorage.setItem(`rating-serie-${params.id}`, value);
  };

  if (!serie) return <p className={styles.loading}>Chargement...</p>;

  return (
    <div className={styles.container}>
      <img
        src={
          serie.poster_path
            ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
            : "/placeholder.jpg"
        }
        alt={serie.name}
        className={styles.poster}
      />
      <div className={styles.details}>
        <h1 className={styles.title}>{serie.name}</h1>
        <p className={styles.subtitle}>
          Première diffusion :{" "}
          {new Date(serie.first_air_date).toLocaleDateString("fr-FR")}
        </p>
        <p className={styles.subtitle}>
          ⭐ {serie.vote_average.toFixed(1)} —{" "}
          {serie.genres.map((g) => g.name).join(", ")}
        </p>
        <p className={styles.overview}>{serie.overview}</p>

        {trailerKey && (
          <div className={styles.trailer}>
            <h3>Bande-annonce</h3>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Bande-annonce"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.addButton}>+ Ajouter à ma liste</button>
        </div>

        <div className={styles.rating}>
          <span className={styles.rateLabel}>Votre note :</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`${styles.star} ${
                hovered > 0
                  ? n <= hovered
                    ? styles.filled
                    : ""
                  : n <= rating
                  ? styles.filled
                  : ""
              }`}
              onClick={() => handleRate(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
            >
              ★
            </button>
          ))}
        </div>

        <a href="/" className={styles.backButton}>
          ← Retour
        </a>
      </div>
    </div>
  );
}
