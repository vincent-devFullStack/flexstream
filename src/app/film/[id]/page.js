"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import ProviderSection from "../../components/ProviderSection";
import CastSection from "../../components/CastSection";
import styles from "../../styles/FilmDetail.module.css";
import { BiSolidLeftArrow } from "react-icons/bi";

export default function FilmDetail() {
  const { id } = useParams();
  const pathname = usePathname();
  const isSerie = pathname.includes("/series");
  const type = isSerie ? "tv" : "movie";

  const [media, setMedia] = useState(null);
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
    if (!id) return;

    async function loadMediaDetails() {
      try {
        // Détails
        const res = await fetch(
          `/api/${type === "tv" ? "series" : "films"}/${id}`
        );
        const data = await res.json();
        setMedia(data);

        // Trailer
        const videoRes = await fetch(
          `/api/${type === "tv" ? "series" : "films"}/${id}/videos`
        );
        const videoData = await videoRes.json();
        const trailer = videoData.results?.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );
        if (trailer) setTrailerKey(trailer.key);

        // Plateformes
        const provRes = await fetch(`/api/providers/${type}/${id}`);
        const provData = await provRes.json();
        setProviders(provData);

        // Casting
        const castRes = await fetch(`/api/credits/${type}/${id}`);
        const castData = await castRes.json();
        setCast(Array.isArray(castData.cast) ? castData.cast.slice(0, 10) : []);

        // Note locale
        const savedRating = localStorage.getItem(`rating-${id}`);
        if (savedRating) setRating(parseInt(savedRating));
      } catch (err) {
        console.error(`[${type}] Erreur lors du chargement de l'œuvre :`, err);
      }
    }

    loadMediaDetails();
  }, [id, type]);

  const handleRate = (value) => {
    setRating(value);
    localStorage.setItem(`rating-${id}`, value);
  };

  if (!media) return <p className={styles.loading}>Chargement...</p>;

  const title = media.title || media.name;
  const date = media.release_date || media.first_air_date;
  const description =
    media.overview?.trim() || "Aucune description disponible pour ce contenu.";

  return (
    <div className={styles.container}>
      <img
        src={
          media.poster_path
            ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
            : "/placeholder.jpg"
        }
        alt={`Affiche de ${title}`}
        className={styles.poster}
      />

      <div className={styles.details}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>
          Sortie : {new Date(date).toLocaleDateString("fr-FR")}
        </p>
        <p className={styles.subtitle}>
          ⭐ {media.vote_average.toFixed(1)} —{" "}
          {media.genres.map((g) => g.name).join(", ")}
        </p>

        <p className={styles.overview}>{description}</p>

        {trailerKey && (
          <div className={styles.trailer}>
            <h3>Bande-annonce</h3>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title={`Bande-annonce de ${title}`}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        )}

        <CastSection cast={cast} />

        {providers.flatrate.length ||
        providers.rent.length ||
        providers.buy.length ? (
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
                hovered >= n || rating >= n ? styles.filled : ""
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
            Retour
          </span>
        </a>
      </div>
    </div>
  );
}
