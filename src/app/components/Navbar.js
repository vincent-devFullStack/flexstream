"use client";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef(null);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/recherche?query=${encodeURIComponent(search.trim())}`);
      setSuggestions([]);
    }
  };

  const getActiveClass = (path) => (pathname === path ? styles.active : "");

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length > 2) {
        try {
          const res = await fetch(
            `/api/recherche?query=${encodeURIComponent(search)}`
          );
          const data = await res.json();
          const safeResults = Array.isArray(data.results) ? data.results : [];
          setSuggestions(safeResults.slice(0, 5));
        } catch (err) {
          console.error("Erreur suggestions :", err);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  // Gérer clic extérieur + touche Échap
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        <img
          src="/flexstream.svg"
          alt="Logo flexstream"
          width={120}
          height={30}
        />
      </Link>

      <form
        onSubmit={handleSearchSubmit}
        className={styles.searchBar}
        ref={searchRef}
      >
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={search}
          onChange={handleSearchChange}
          autoComplete="off"
        />
        <button type="submit">
          <img src="/icons/search.svg" alt="Search" width={16} height={16} />
        </button>

        {suggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.map((movie) => (
              <li key={movie.id} className={styles.suggestionItem}>
                <Link
                  href={`/film/${movie.id}`}
                  onClick={() => setSuggestions([])}
                  className={styles.suggestionLink}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : "/placeholder.jpg"
                    }
                    alt={movie.title}
                    className={styles.suggestionImage}
                  />
                  <div className={styles.suggestionContent}>
                    <span className={styles.suggestionTitle}>
                      {movie.title}
                    </span>
                    <span className={styles.suggestionRating}>
                      ⭐ {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </form>

      <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
        <Link
          href="/"
          className={getActiveClass("/")}
          onClick={() => setMenuOpen(false)}
        >
          Accueil
        </Link>
        <Link
          href="/film"
          className={getActiveClass("/film")}
          onClick={() => setMenuOpen(false)}
        >
          Films
        </Link>
        <Link
          href="/serie"
          className={getActiveClass("/series")}
          onClick={() => setMenuOpen(false)}
        >
          Séries
        </Link>
        <Link
          href="/login"
          className={`${styles.mobileSignIn} ${styles.mobileOnly}`}
          onClick={() => setMenuOpen(false)}
        >
          Connexion
        </Link>
      </div>

      <div className={`${styles.userActions} ${styles.desktopOnly}`}>
        <Link href="/login" className={styles.signIn}>
          Connexion
        </Link>
      </div>

      <button
        className={styles.burger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        ☰
      </button>
    </nav>
  );
}
