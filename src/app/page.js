import styles from "./page.module.css";
import Movie from "./components/Movie";
import Navbar from "./components/Navbar";

export default function Home() {
  const movies = [];
  const content = (
    <div>
      <p>Movie 1</p>
      <p>Movie 2</p>
      <p>Movie 3</p>
      <p>Movie 4</p>
    </div>
  );

  for (let i = 0; i < 10; i++) {
    movies.push(<Movie />);
  }

  return (
    <>
      <Navbar />
      <header className={styles.header}>
        <h1>Faux Plex</h1>
        <p>Votre plateforme de streaming préférée</p>
      </header>
      <main className={styles.main}>
        <div className={styles.grid}>{movies}</div>
        <div className={styles.content}>{content}</div>
      </main>
      <footer className={styles.footer}>
        <p>© 2025 Faux Plex by Vincent Silvestri. All rights reserved.</p>
      </footer>
    </>
  );
}
