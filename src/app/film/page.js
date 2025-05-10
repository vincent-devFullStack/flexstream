"use client";
import { useEffect, useState, useCallback } from "react";
import styles from "../page.module.css";
import Navbar from "../components/Navbar";
import Movie from "../components/Movie";

export default function FilmPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/films");
        const { popular, topRated } = await res.json(); // ✅ destructure bien

        const genreNames = {
          28: "Action",
          12: "Aventure",
          16: "Animation",
          35: "Comédie",
          80: "Crime",
          99: "Documentaire",
          18: "Drame",
          10751: "Famille",
          14: "Fantasy",
          36: "Histoire",
          27: "Horreur",
          10402: "Musique",
          9648: "Mystère",
          10749: "Romance",
          878: "Science-fiction",
          10770: "Téléfilm",
          53: "Thriller",
          10752: "Guerre",
          37: "Western",
        };

        const genreMap = {};

        [...popular, ...topRated].forEach((movie) => {
          movie.genre_ids.forEach((id) => {
            const genre = genreNames[id];
            if (!genre) return;

            if (!genreMap[genre]) genreMap[genre] = [];

            genreMap[genre].push({
              id: movie.id,
              title: movie.title,
              description: movie.overview || "Pas de description disponible",
              image: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder.jpg",
              rating: movie.vote_average,
            });
          });
        });

        const result = Object.entries(genreMap).map(([genre, movies]) => ({
          genre,
          movies,
        }));

        setCategories(result);
      } catch (error) {
        console.error("Erreur chargement films :", error);
      }
    }

    fetchData();
  }, []);

  const scrollRow = useCallback((genre, scrollAmount) => {
    const row = document.getElementById(`row-${genre}`);
    if (row) {
      row.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <Navbar />
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Ma sélection de films</h1>
          <p className={styles.headerDescription}>
            Découvrez mes coups de cœur par genre.
          </p>
        </div>
      </header>

      <main className={`${styles.main} backgrounds`}>
        {categories.map(({ genre, movies }) => (
          <section key={genre}>
            <h2 className={styles.sectionTitle}>{genre}</h2>
            <div className={styles.movieRowWrapper}>
              <button
                className={styles.scrollButton}
                onClick={() => scrollRow(genre, -300)}
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
                onClick={() => scrollRow(genre, 300)}
              >
                ▶
              </button>
            </div>
          </section>
        ))}
      </main>

      <footer className={styles.footer}>
        <p>© 2025 FlexStream by Vincent Silvestri. All rights reserved.</p>
      </footer>
    </>
  );
}
