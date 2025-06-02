"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import ProviderSection from "../../components/ProviderSection";
import CastSection from "../../components/CastSection";
import styles from "../../styles/FilmDetail.module.css";
import { BiSolidLeftArrow } from "react-icons/bi";
import { jwtDecode } from "jwt-decode";
import Navbar from "../../components/Navbar";

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
  const [user, setUser] = useState(null);
  const [isInList, setIsInList] = useState(false);

  // Chargement des détails du film/série
  useEffect(() => {
    if (!id) return;

    async function loadMediaDetails() {
      try {
        const res = await fetch(
          `/api/${type === "tv" ? "series" : "films"}/${id}`
        );
        const data = await res.json();
        setMedia(data);

        const videoRes = await fetch(
          `/api/${type === "tv" ? "series" : "films"}/${id}/videos`
        );
        const videoData = await videoRes.json();
        const trailer = videoData.results?.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );
        if (trailer) setTrailerKey(trailer.key);

        const provRes = await fetch(`/api/providers/${type}/${id}`);
        const provData = await provRes.json();
        setProviders(provData);

        const castRes = await fetch(`/api/credits/${type}/${id}`);
        const castData = await castRes.json();
        setCast(Array.isArray(castData.cast) ? castData.cast.slice(0, 10) : []);

        const savedRating = localStorage.getItem(`rating-${id}`);
        if (savedRating) setRating(parseInt(savedRating));
      } catch (err) {
        console.error(`[${type}] Erreur lors du chargement de l'œuvre :`, err);
      }
    }

    loadMediaDetails();
  }, [id, type]);

  // Chargement complet de l'utilisateur (via API)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        jwtDecode(token); // juste pour valider
        const res = await fetch("/api/user/profile", {
          headers: { token },
        });
        const data = await res.json();
        if (res.ok) setUser(data.user);
      } catch (err) {
        console.error("Erreur lors du chargement du profil utilisateur :", err);
      }
    };

    fetchUser();
  }, []);

  // Détection si ce média est déjà dans la liste de l'utilisateur
  useEffect(() => {
    if (!user || !media) return;
    const list = isSerie ? user.series : user.movies;
    const isIn = list?.some((item) => item.tmdbId === media.id);
    setIsInList(isIn);
  }, [media, user]);

  const handleRate = (value) => {
    setRating(value);
    localStorage.setItem(`rating-${id}`, value);
  };

  const handleAddToList = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user || !media) return;

    const title = media.title || media.name;

    const body = {
      type: isSerie ? "series" : "movies",
      tmdbId: media.id,
      title,
      posterPath: media.poster_path,
      note: rating,
    };

    const res = await fetch("/api/user/add-media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) {
      setIsInList(true);
      console.log("Ajouté à votre liste !");
    } else {
      console.error("Erreur lors de l'ajout :", data.error);
    }
  };

  const handleRemoveFromList = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user || !media?.id) return;

    const typeToSend = isSerie ? "series" : "movies";

    try {
      const res = await fetch("/api/user/remove-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          type: typeToSend,
          tmdbId: media.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsInList(false);
        console.log("Retiré de votre liste !");
      } else {
        console.error("Erreur lors de la suppression :", data.error);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    }
  };

  if (!media) return <p className={styles.loading}>Chargement...</p>;

  const title = media.title || media.name;
  const date = media.release_date || media.first_air_date;
  const description =
    media.overview?.trim() || "Aucune description disponible pour ce contenu.";

  return (
    <>
      <Navbar />
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
              <ProviderSection
                title="À la location"
                providers={providers.rent}
              />
              <ProviderSection title="À l'achat" providers={providers.buy} />
            </>
          ) : (
            <p
              style={{ marginTop: "1rem", fontStyle: "italic", color: "#aaa" }}
            >
              Aucune plateforme de streaming n'est disponible pour ce{" "}
              {type === "tv" ? "série" : "film"}.
            </p>
          )}

          <div className={styles.actions}>
            {isInList ? (
              <button
                className={styles.removeButton}
                onClick={handleRemoveFromList}
                disabled={!user}
              >
                − Retirer de ma liste
              </button>
            ) : (
              <button
                className={styles.addButton}
                onClick={handleAddToList}
                disabled={!user}
              >
                + Ajouter à ma liste
              </button>
            )}
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
    </>
  );
}
