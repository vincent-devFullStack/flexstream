"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "../page.module.css";
import Navbar from "../components/Navbar";
import Movie from "../components/Movie";

export default function SeriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadUserSeries = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/user/profile", {
          headers: { token },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur serveur");

        const userSeries = data.series || [];

        // 🔁 Regrouper par genre
        const grouped = {};

        userSeries.forEach((serie) => {
          (serie.genres || []).forEach((genre) => {
            if (!grouped[genre]) grouped[genre] = [];

            grouped[genre].push({
              id: serie.tmdbId,
              title: serie.title,
              image: serie.posterPath
                ? `https://image.tmdb.org/t/p/w500${serie.posterPath}`
                : "/placeholder.jpg",
              rating: serie.note,
              description: "",
            });
          });
        });

        const result = Object.entries(grouped).map(([genre, series]) => ({
          genre,
          movies: series, // on garde le même nom que pour Movie component
        }));

        setCategories(result);
      } catch (err) {
        console.error("[Series] Erreur de chargement :", err);
      }
    };

    loadUserSeries();
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
            Découvrez les séries ajoutées à votre liste triées par genre.
          </p>
        </div>
      </header>

      <main className={`${styles.main} backgrounds`}>
        {categories.length === 0 ? (
          <p style={{ textAlign: "center", color: "white" }}>
            Aucune série dans votre liste 😥
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
