import styles from "./page.module.css";
import Movie from "./components/Movie";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";

export default function Home() {
  const mockMovies = [
    { id: 1, title: "Inception", description: "Un voleur infiltre les rêves." },
    {
      id: 2,
      title: "Interstellar",
      description: "Un voyage à travers l'espace-temps.",
    },
    {
      id: 3,
      title: "The Dark Knight",
      description: "Batman affronte le Joker.",
    },
    {
      id: 4,
      title: "Tenet",
      description: "Une mission inversée dans le temps.",
    },
    {
      id: 5,
      title: "Dunkirk",
      description:
        "L’évacuation des troupes alliées pendant la Seconde Guerre mondiale.",
    },
  ];

  const heroImages = [
    "/banner1.jpg",
    "/banner2.jpg",
    "/banner3.jpg",
    "/banner4.jpg",
  ];

  // Carousel avec images plein écran
  const carouselItems = heroImages.map((src, index) => (
    <img
      key={index}
      src={src}
      alt={`Slide ${index + 1}`}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  ));

  // Affichage des films
  const movieGrid = mockMovies.map((movie) => (
    <Movie
      key={`grid-${movie.id}`}
      title={movie.title}
      description={movie.description}
    />
  ));

  return (
    <>
      <Navbar />
      <header className={styles.header}>
        <Carousel items={carouselItems} autoPlay={true} delay={4000} />
        <div className={styles.headerContent}>
          <h1>Faux Plex</h1>
          <p>Votre plateforme de streaming préférée</p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>{movieGrid}</div>

        <div className={styles.content}>
          <p>Movie 1</p>
          <p>Movie 2</p>
          <p>Movie 3</p>
          <p>Movie 4</p>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 Faux Plex by Vincent Silvestri. All rights reserved.</p>
      </footer>
    </>
  );
}
