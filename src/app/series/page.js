"use client";
import { useEffect, useState } from "react";
import styles from "../page.module.css";
import Navbar from "../components/Navbar";
import Movie from "../components/Movie";
import { getPopularSeries, getTopRatedSeries } from "../../lib/tmdb";

export default function SeriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const popular = await getPopularSeries();
        const topRated = await getTopRatedSeries();

        const seriesGenres = {
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

        const genreMap = {};

        popular.concat(topRated).forEach((serie) => {
          serie.genre_ids.forEach((genreId) => {
            const genreName = seriesGenres[genreId];
            if (genreName) {
              if (!genreMap[genreName]) {
                genreMap[genreName] = [];
              }
              genreMap[genreName].push({
                id: serie.id,
                title: serie.name,
                description: serie.overview,
                image: serie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
                  : "/placeholder.jpg",
                rating: serie.vote_average,
              });
            }
          });
        });

        const categoriesArray = Object.keys(genreMap).map((genre) => ({
          genre,
          movies: genreMap[genre],
        }));

        setCategories(categoriesArray);
      } catch (error) {
        console.error("Erreur chargement séries:", error);
      }
    }

    fetchData();
  }, []);

  function scrollRow(genre, scrollAmount) {
    const row = document.getElementById(`row-${genre}`);
    if (row) {
      row.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }

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
          categories.map((category) => (
            <section key={category.genre}>
              <h2 className={styles.sectionTitle}>{category.genre}</h2>
              <div className={styles.movieRowWrapper}>
                <button
                  className={styles.scrollButton}
                  onClick={() => scrollRow(category.genre, -300)}
                >
                  ◀
                </button>
                <div className={styles.movieRow} id={`row-${category.genre}`}>
                  {category.movies.map((serie) => (
                    <Movie
                      key={serie.id}
                      id={serie.id}
                      title={serie.title}
                      description={serie.description}
                      image={serie.image}
                      rating={serie.rating}
                    />
                  ))}
                </div>
                <button
                  className={styles.scrollButton}
                  onClick={() => scrollRow(category.genre, 300)}
                >
                  ▶
                </button>
              </div>
            </section>
          ))
        )}
      </main>
    </>
  );
}
