"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProviderSection from "../../components/ProviderSection";
import CastSection from "../../components/CastSection";
import styles from "../../styles/FilmDetail.module.css";
import { BiSolidLeftArrow } from "react-icons/bi";
import { jwtDecode } from "jwt-decode";

export default function SerieDetail() {
  const { id } = useParams();
  const [serie, setSerie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [providers, setProviders] = useState({
    flatrate: [],
    rent: [],
    buy: [],
  });
  const [cast, setCast] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function loadSerieDetails() {
      try {
        const [detailRes, videoRes, providerRes, castRes] = await Promise.all([
          fetch(`/api/series/${id}`),
          fetch(`/api/series/${id}/videos`),
          fetch(`/api/providers/tv/${id}`),
          fetch(`/api/credits/tv/${id}`),
        ]);

        const [detailData, videoData, providerData, castData] =
          await Promise.all([
            detailRes.json(),
            videoRes.json(),
            providerRes.json(),
            castRes.json(),
          ]);

        setSerie(detailData);

        const trailer = videoData.results?.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );
        if (trailer) setTrailerKey(trailer.key);

        setProviders(providerData);
        setCast(Array.isArray(castData.cast) ? castData.cast.slice(0, 10) : []);

        const savedRating = localStorage.getItem(`rating-${id}`);
        if (savedRating) setRating(parseInt(savedRating));
      } catch (err) {
        console.error(
          `[Serie] Erreur lors du chargement de la série ${id} :`,
          err
        );
      }
    }

    loadSerieDetails();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Token invalide");
      }
    }
  }, []);

  const handleRate = (value) => {
    setRating(value);
    localStorage.setItem(`rating-${id}`, value);
  };

  const handleAddToList = async () => {
    const token = localStorage.getItem("token");
    if (!token || !serie || !user) return;

    const res = await fetch("/api/user/add-media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        type: "series",
        tmdbId: serie.id,
        title: serie.name,
        posterPath: serie.poster_path,
        note: rating,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Série ajoutée à votre liste !");
    } else {
      alert(data.error || "Erreur lors de l'ajout");
    }
  };

  if (!serie) return <p className={styles.loading}>Chargement...</p>;

  const title = serie.name;
  const date = serie.first_air_date;
  const description =
    serie.overview?.trim() || "Aucune description disponible pour cette série.";

  return (
    <div className={styles.container}>
      <img
        src={
          serie.poster_path
            ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
            : "/placeholder.jpg"
        }
        alt={`Affiche de ${title}`}
        className={styles.poster}
      />

      <div className={styles.details}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>
          Première diffusion : {new Date(date).toLocaleDateString("fr-FR")}
        </p>
        <p className={styles.subtitle}>
          ⭐ {serie.vote_average.toFixed(1)} —{" "}
          {serie.genres.map((g) => g.name).join(", ")}
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
            Aucune plateforme de streaming n'est disponible pour cette série.
          </p>
        )}

        <div className={styles.actions}>
          <button
            onClick={handleAddToList}
            className={styles.addButton}
            disabled={!user}
            title={!user ? "Connectez-vous pour ajouter à votre liste" : ""}
          >
            + Ajouter à ma liste
          </button>
        </div>

        <div className={styles.rating}>
          <span className={styles.rateLabel}>Votre note :</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`${styles.star} ${
                hovered >= n || rating >= n ? styles.filled : ""
              }`}
              onClick={() => user && handleRate(n)}
              onMouseEnter={() => user && setHovered(n)}
              onMouseLeave={() => user && setHovered(0)}
              disabled={!user}
              title={!user ? "Connectez-vous pour noter" : ""}
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
