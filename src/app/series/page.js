"use client";
import styles from "../page.module.css";
import Navbar from "../components/Navbar";
import Movie from "../components/Movie";

const favoriteSeries = [
  {
    genre: "Drame",
    movies: [
      {
        id: "breaking-bad",
        title: "Breaking Bad",
        description: "Un professeur de chimie devient fabricant de meth.",
        image: "/banner1.jpg",
        rating: 9.5,
      },
      {
        id: "the-wire",
        title: "The Wire",
        description: "Plongée réaliste dans la ville de Baltimore.",
        image: "/banner2.jpg",
        rating: 9.3,
      },
    ],
  },
  {
    genre: "Comédie",
    movies: [
      {
        id: "friends",
        title: "Friends",
        description: "Les aventures drôles et touchantes d’un groupe d’amis.",
        image: "/banner3.jpg",
        rating: 8.9,
      },
      {
        id: "the-office",
        title: "The Office",
        description: "Une sitcom hilarante sur la vie de bureau.",
        image: "/banner4.jpg",
        rating: 8.8,
      },
    ],
  },
];

export default function SeriesPage() {
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
            Découvrez mes séries préférées par genre.
          </p>
        </div>
      </header>
      <main className={`${styles.main} backgrounds`}>
        {favoriteSeries.map((category) => (
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
        ))}
      </main>
    </>
  );
}
