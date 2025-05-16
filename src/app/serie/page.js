"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "../page.module.css";
import Navbar from "../components/Navbar";
import Movie from "../components/Movie";

export default function SeriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const res = await fetch("/api/series");
        const { popular, topRated } = await res.json();

        const genreLabels = {
          35: "Comédie",
          18: "Drame",
          10759: "Action & Aventure",
          10765: "Science-Fiction",
          10766: "Soap",
          10764: "Téléréalité",
          80: "Policier",
          9648: "Mystère",
          10751: "Familial",
          10767: "Talk-show",
          10763: "Actualités",
        };

        const groupedByGenre = {};

        [...popular, ...topRated].forEach((serie) => {
          serie.genre_ids.forEach((id) => {
            const genre = genreLabels[id];
            if (!genre) return;

            if (!groupedByGenre[genre]) groupedByGenre[genre] = [];

            groupedByGenre[genre].push({
              id: serie.id,
              title: serie.name,
              description: serie.overview || "Pas de description disponible",
              image: serie.poster_path
                ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
                : "/placeholder.jpg",
              rating: serie.vote_average,
            });
          });
        });

        const structured = Object.entries(groupedByGenre).map(
          ([genre, series]) => ({
            genre,
            movies: series,
          })
        );

        setCategories(structured);
      } catch (err) {
        console.error("[Series] Erreur de chargement :", err);
      }
    };

    loadSeries();
  }, []);

  const scrollGenreRow = useCallback((genre, offset) => {
    const row = document.getElementById(`row-${genre}`);
    if (row) {
      row.scrollBy({ left: offset, behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <Navbar />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Ma sélection de séries</h1>
          <p className={styles.headerDescription}>
            Découvrez les séries incontournables triées par genre.
          </p>
        </div>
      </header>

      <main className={`${styles.main} backgrounds`}>
        {categories.length === 0 ? (
          <p style={{ textAlign: "center", color: "white" }}>
            Aucune série trouvée 😥
          </p>
        ) : (
          categories.map(({ genre, movies }) => (
            <section key={genre}>
              <h2 className={styles.sectionTitle}>{genre}</h2>
              <div className={styles.movieRowWrapper}>
                <button
                  className={styles.scrollButton}
                  onClick={() => scrollGenreRow(genre, -300)}
                  aria-label={`Faire défiler les séries ${genre} vers la gauche`}
                >
                  ◀
                </button>
                <div className={styles.movieRow} id={`row-${genre}`}>
                  {movies.map((serie) => (
                    <Movie key={`serie-${serie.id}`} {...serie} type="serie" />
                  ))}
                </div>
                <button
                  className={styles.scrollButton}
                  onClick={() => scrollGenreRow(genre, 300)}
                  aria-label={`Faire défiler les séries ${genre} vers la droite`}
                >
                  ▶
                </button>
              </div>
            </section>
          ))
        )}
      </main>

      <footer className={styles.footer}>
        <p>© 2025 FlexStream par Vincent Silvestri. Tous droits réservés.</p>
      </footer>
    </>
  );
}
