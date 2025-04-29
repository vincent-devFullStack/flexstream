import styles from "../../styles/FilmDetail.module.css";
import { getMovieDetails } from "../../../lib/tmdb";

export default async function FilmDetail({ params }) {
  const movie = await getMovieDetails(params.id);

  return (
    <div className={styles.container}>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className={styles.poster}
      />
      <div className={styles.details}>
        <h1 className={styles.title}>{movie.title}</h1>
        <p className={styles.subtitle}>
          Sortie : {new Date(movie.release_date).toLocaleDateString("fr-FR")}
        </p>
        <p className={styles.subtitle}>
          ⭐ {movie.vote_average.toFixed(1)} —{" "}
          {movie.genres.map((g) => g.name).join(", ")}
        </p>
        <p className={styles.overview}>{movie.overview}</p>
        <a href="/" className={styles.backlink}>
          ← Retour
        </a>
      </div>
    </div>
  );
}
