"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "../page.module.css";
import Navbar from "../components/Navbar";
import Movie from "../components/Movie";

export default function FilmPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadUserMovies = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/user/profile", {
          headers: { token },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur serveur");

        const userMovies = data?.user?.movies || [];

        // 🔁 Regrouper par genre
        const grouped = {};

        userMovies.forEach((movie) => {
          (movie.genres || []).forEach((genre) => {
            if (!grouped[genre]) grouped[genre] = [];

            grouped[genre].push({
              id: movie.tmdbId,
              title: movie.title || "Sans titre",
              image: movie.posterPath
                ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                : "/placeholder.jpg",
              rating: movie.note,
              description: "",
            });
          });
        });

        const result = Object.entries(grouped).map(([genre, movies]) => ({
          genre,
          movies,
        }));

        setCategories(result);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      }
    };

    loadUserMovies();
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
          <h1 className={styles.headerTitle}>Ma sélection de films</h1>
          <p className={styles.headerDescription}>
            Découvrez vos films ajoutés classés par genre.
          </p>
        </div>
      </header>

      <main className={`${styles.main} backgrounds`}>
        {categories.length === 0 ? (
          <p style={{ textAlign: "center" }}>Aucun film dans votre liste 😥</p>
        ) : (
          categories.map(({ genre, movies }) => (
            <section key={genre}>
              <h2 className={styles.sectionTitle}>{genre}</h2>

              <div className={styles.movieRowWrapper}>
                <button
                  className={styles.scrollButton}
                  onClick={() => scrollGenreRow(genre, -300)}
                  aria-label={`Défiler ${genre} à gauche`}
                >
                  ◀
                </button>

                <div className={styles.movieRow} id={`row-${genre}`}>
                  {movies.map((movie) => (
                    <Movie key={`movie-${movie.id}`} {...movie} type="film" />
                  ))}
                </div>

                <button
                  className={styles.scrollButton}
                  onClick={() => scrollGenreRow(genre, 300)}
                  aria-label={`Défiler ${genre} à droite`}
                >
                  ▶
                </button>
              </div>
            </section>
          ))
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          © 2025 FlexStream by Vincent Silvestri. All rights reserved. —{" "}
          <a
            href="https://vince-dev.fr"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.portfolioLink}
          >
            Mon portfolio
          </a>
        </p>
      </footer>
    </>
  );
}
