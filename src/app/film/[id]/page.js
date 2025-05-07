"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "../../styles/FilmDetail.module.css";

export default function FilmDetail() {
  const params = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  useEffect(() => {
    if (!params?.id) return;

    async function fetchMovie() {
      try {
        // 1. Récupérer les infos du film
        const res = await fetch(`/api/films/${params.id}`);
        const data = await res.json();
        setMovie(data);

        // 2. Récupérer la bande-annonce via l’API interne sécurisée
        const videoRes = await fetch(`/api/films/${params.id}/videos`);
        const videoData = await videoRes.json();
        const trailer = videoData.results?.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );
        if (trailer) setTrailerKey(trailer.key);

        // 3. Charger note utilisateur
        const savedRating = localStorage.getItem(`rating-${params.id}`);
        if (savedRating) setRating(parseInt(savedRating));
      } catch (error) {
        console.error("Erreur lors du chargement du film :", error);
      }
    }

    fetchMovie();
  }, [params?.id]);

  const handleRate = (value) => {
    setRating(value);
    localStorage.setItem(`rating-${params.id}`, value);
  };

  if (!movie) return <p className={styles.loading}>Chargement...</p>;

  return (
    <div className={styles.container}>
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/placeholder.jpg"
        }
        alt={movie.title}
        className={styles.poster}
      />

      <div className={styles.details}>
        <h1 className={styles.title}>{movie.title}</h1>
        <p className={styles.subtitle}>
          Sortie : {new Date(movie.release_date).toLocaleDateString("fr-FR")}
        </p>
        <p className={styles.subtitle}>
          ⭐ {movie.vote_average.toFixed(1)} —{" "}
          {movie.genres.map((g) => g.name).join(", ")}
        </p>

        <p className={styles.overview}>{movie.overview}</p>

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
