import styles from "./page.module.css";
import Movie from "./components/Movie";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import { getPopularMovies } from "./api/tmdb";

export default async function Home() {
  const movies = await getPopularMovies();

  const heroImages = [
    "/banner1.jpg",
    "/banner2.jpg",
    "/banner3.jpg",
    "/banner4.jpg",
  ];

  const carouselItems = heroImages.map((src, index) => (
    <img
      key={index}
      src={src}
      alt={`Slide ${index + 1}`}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  ));

  const movieGrid = movies.map((movie) => (
    <Movie
      key={`grid-${movie.id}`}
      id={movie.id}
      title={movie.title}
      description={movie.overview}
      image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      rating={movie.vote_average}
      type="film"
    />
  ));

  return (
    <>
      <Navbar />
      <header className={styles.header}>
        <Carousel items={carouselItems} autoPlay={true} delay={4000} />
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>FlexStream</h1>
          <p className={styles.headerDescription}>
            À la recherche de quelque chose à regarder ? FlexStream vous propose
            des films et séries disponibles gratuitement, sans engagement.
            Profitez d’une expérience simple et rapide pour découvrir du
            contenu.
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>{movieGrid}</div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 FlexStream by Vincent Silvestri. All rights reserved.</p>
      </footer>
    </>
  );
}
