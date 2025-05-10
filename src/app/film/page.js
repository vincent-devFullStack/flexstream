import styles from "../page.module.css";
import Navbar from "../components/Navbar";
import Movie from "../components/Movie";
import { getPopularMovies } from "../api/tmdb";

export default async function FilmPage() {
  const popular = await getPopularMovies();

  // Regrouper les films par genre
  const genreMap = {};

  popular.forEach((movie) => {
    movie.genre_ids.forEach((genreId) => {
      const genreName = getGenreNameById(genreId);
      if (!genreMap[genreName]) {
        genreMap[genreName] = [];
      }
      genreMap[genreName].push(movie);
    });
  });

  const categories = Object.keys(genreMap).map((genre) => ({
    genre,
    movies: genreMap[genre].map((m) => ({
      id: m.id,
      title: m.title,
      description: m.overview,
      image: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      rating: m.vote_average,
    })),
  }));

  function getGenreNameById(id) {
    const genreMap = {
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
    return genreMap[id] || "Autre";
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
        {categories.map((category) => (
          <section key={category.genre}>
            <h2 className={styles.sectionTitle}>{category.genre}</h2>
            <div className={styles.movieRowWrapper}>
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
