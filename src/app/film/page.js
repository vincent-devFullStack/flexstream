"use client";
import styles from "../page.module.css";
import Navbar from "../components/Navbar";
import Movie from "../components/Movie";

const favoriteMovies = [
  {
    genre: "Action",
    movies: [
      {
        id: "die-hard",
        title: "Die Hard",
        description:
          "John McClane affronte des terroristes dans un gratte-ciel.",
        image: "/banner1.jpg",
        rating: 8.2,
      },
      {
        id: "mad-max",
        title: "Mad Max",
        description:
          "Dans un futur apocalyptique, Max parcourt les routes désertiques.",
        image: "/banner2.jpg",
        rating: 7.9,
      },
    ],
  },
  {
    genre: "Comédie",
    movies: [
      {
        id: "superbad",
        title: "Superbad",
        description:
          "Deux amis inséparables tentent de profiter de leur dernier été.",
        image: "/banner3.jpg",
        rating: 7.6,
      },
      {
        id: "the-mask",
        title: "The Mask",
        description:
          "Un homme timide découvre un masque qui change sa personnalité.",
        image: "/banner4.jpg",
        rating: 6.9,
      },
    ],
  },
];

export default function FilmPage() {
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
          <h1 className={styles.headerTitle}>Ma sélection de films</h1>
          <p className={styles.headerDescription}>
            Découvrez mes coups de cœur par genre.
          </p>
        </div>
      </header>
      <main className={`${styles.main} backgrounds`}>
        {favoriteMovies.map((category) => (
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
                {category.movies.map((movie) => (
                  <Movie
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    description={movie.description}
                    image={movie.image}
                    rating={movie.rating}
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
        ))}
      </main>
    </>
  );
}
