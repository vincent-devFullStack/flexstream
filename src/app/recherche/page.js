import { getSearchResults } from "../../lib/tmdb";
import Movie from "../components/Movie";
import styles from "../page.module.css";

export default async function Recherche({ searchParams }) {
  const query = searchParams.query?.trim();

  if (!query) {
    return (
      <main className={styles.main}>
        <h1>Recherche</h1>
        <p>Entrez un mot-clé pour lancer une recherche de film ou série.</p>
      </main>
    );
  }

  const results = await getSearchResults(query);

  const filteredResults = results.filter(
    (item) => item.poster_path && item.title && item.vote_average !== undefined
  );

  return (
    <main className={styles.main}>
      <h1>Résultats pour « {query} »</h1>

      {filteredResults.length > 0 ? (
        <div className={styles.grid}>
          {filteredResults.map((movie) => (
            <Movie
              key={movie.id}
              id={movie.id}
              title={movie.title}
              description={movie.overview}
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              rating={movie.vote_average}
              type={movie.type === "tv" ? "serie" : "film"}
            />
          ))}
        </div>
      ) : (
        <p>Aucun résultat trouvé pour « {query} ».</p>
      )}
    </main>
  );
}
