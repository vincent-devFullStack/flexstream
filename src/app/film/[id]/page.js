"use client";
import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import ProviderSection from "../../components/ProviderSection";
import CastSection from "../../components/CastSection";
import styles from "../../styles/FilmDetail.module.css";
import { BiSolidLeftArrow } from "react-icons/bi";

export default function FilmDetail() {
  const params = useParams();
  const pathname = usePathname();
  const isSerie = pathname.includes("/series");
  const type = isSerie ? "tv" : "movie";

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [providers, setProviders] = useState({
    flatrate: [],
    rent: [],
    buy: [],
  });
  const [cast, setCast] = useState([]);

  useEffect(() => {
    if (!params?.id) return;

    async function fetchMedia() {
      try {
        // Détail du film ou série
        const res = await fetch(
          `/api/${type === "tv" ? "series" : "films"}/${params.id}`
        );
        const data = await res.json();
        setMovie(data);

        // Vidéos
        const videoRes = await fetch(
          `/api/${type === "tv" ? "series" : "films"}/${params.id}/videos`
        );
        const videoData = await videoRes.json();
        const trailer = videoData.results?.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );
        if (trailer) setTrailerKey(trailer.key);

        // Plateformes
        const provRes = await fetch(`/api/providers/${type}/${params.id}`);
        const provData = await provRes.json();
        setProviders(provData);

        // Casting
        const castRes = await fetch(`/api/credits/${type}/${params.id}`);
        const castData = await castRes.json();
        setCast(Array.isArray(castData.cast) ? castData.cast.slice(0, 10) : []);

        // Note utilisateur
        const savedRating = localStorage.getItem(`rating-${params.id}`);
        if (savedRating) setRating(parseInt(savedRating));
      } catch (error) {
        console.error("Erreur chargement complet :", error);
      }
    }

    fetchMedia();
  }, [params?.id, type]);

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
        alt={movie.title || movie.name}
        className={styles.poster}
      />

      <div className={styles.details}>
        <h1 className={styles.title}>{movie.title || movie.name}</h1>
        <p className={styles.subtitle}>
          Sortie :{" "}
          {new Date(
            movie.release_date || movie.first_air_date
          ).toLocaleDateString("fr-FR")}
        </p>
        <p className={styles.subtitle}>
          ⭐ {movie.vote_average.toFixed(1)} —{" "}
          {movie.genres.map((g) => g.name).join(", ")}
        </p>

        <p className={styles.overview}>
          {movie.overview?.trim()
            ? movie.overview
            : "Aucune description disponible pour ce film."}
        </p>

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

        <CastSection cast={cast} />

        {providers.flatrate.length > 0 ||
        providers.rent.length > 0 ||
        providers.buy.length > 0 ? (
          <>
            <ProviderSection
              title="En streaming avec abonnement"
              providers={providers.flatrate}
            />
            <ProviderSection title="À la location" providers={providers.rent} />
            <ProviderSection title="À l'achat" providers={providers.buy} />
          </>
        ) : (
          <p style={{ marginTop: "1rem", fontStyle: "italic", color: "#aaa" }}>
            Aucune plateforme de streaming n'est disponible pour ce{" "}
            {type === "tv" ? "série" : "film"}.
          </p>
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
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <BiSolidLeftArrow style={{ fontSize: "1rem" }} />
            <span>Retour</span>
          </span>
        </a>
      </div>
    </div>
  );
}
