import { getSearchResults } from "../api/tmdb";
import Movie from "../components/Movie";
import styles from "../page.module.css";

export default async function Recherche({ searchParams }) {
  const query = searchParams.query;

  if (!query) return <p>Entrez un mot-clé pour rechercher un film.</p>;

  const results = await getSearchResults(query);

  return (
    <main className={styles.main}>
      <h1>Résultats pour « {query} »</h1>
      <div className={styles.grid}>
        {results.map((movie) => (
          <Movie
            key={movie.id}
            id={movie.id}
            title={movie.title}
            description={movie.overview}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            rating={movie.vote_average}
          />
        ))}
      </div>
    </main>
  );
}
