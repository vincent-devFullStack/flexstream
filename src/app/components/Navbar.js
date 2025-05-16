"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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

  const isActive = (path) => (pathname === path ? styles.active : "");

  useEffect(() => {
    const controller = new AbortController();

    const fetchSuggestions = async () => {
      if (search.length <= 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `/api/recherche?query=${encodeURIComponent(search)}`,
          {
            signal: controller.signal,
          }
        );
        const data = await res.json();
        const results = Array.isArray(data.results) ? data.results : [];

        const movies = results
          .filter((item) => item.type === "movie")
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 4);

        const series = results
          .filter((item) => item.type === "tv")
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 4);

        setSuggestions([...series, ...movies]);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Erreur lors du chargement des suggestions :", err);
        }
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") setSuggestions([]);
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
      <Link href="/" className={styles.logo} aria-label="Accueil Flexstream">
        <img
          src="/flexstream.svg"
          alt="Logo Flexstream"
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
          placeholder="Rechercher un film ou une série..."
          value={search}
          onChange={handleSearchChange}
          autoComplete="off"
          aria-label="Recherche"
        />
        <button
          type="submit"
          className={styles.searchButton}
          aria-label="Lancer la recherche"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="#ffc940"
            viewBox="0 0 24 24"
          >
            <path d="M21.71 20.29l-3.388-3.388A8.94 8.94 0 0 0 19 11a9 9 0 1 0-9 9 8.94 8.94 0 0 0 5.902-2.679l3.388 3.388a1 1 0 0 0 1.42-1.42zM4 11a7 7 0 1 1 7 7 7 7 0 0 1-7-7z" />
          </svg>
        </button>

        {suggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.map((item) => (
              <li
                key={`${item.type}-${item.id}`}
                className={styles.suggestionItem}
              >
                <Link
                  href={`/${item.type === "tv" ? "serie" : "film"}/${item.id}`}
                  className={styles.suggestionLink}
                  onClick={() => setSuggestions([])}
                >
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                        : "/placeholder.jpg"
                    }
                    alt={`Affiche de ${item.title}`}
                    className={styles.suggestionImage}
                  />
                  <div className={styles.suggestionContent}>
                    <span className={styles.suggestionTitle}>{item.title}</span>
                    <span className={styles.suggestionRating}>
                      ⭐ {item.vote_average?.toFixed(1)}
                    </span>
                    <span className={styles.suggestionType}>
                      {item.type === "tv" ? "📺 Série" : "🎬 Film"}
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
          className={isActive("/")}
          onClick={() => setMenuOpen(false)}
        >
          Accueil
        </Link>
        <Link
          href="/film"
          className={isActive("/film")}
          onClick={() => setMenuOpen(false)}
        >
          Films
        </Link>
        <Link
          href="/serie"
          className={isActive("/series")}
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
        aria-label="Ouvrir ou fermer le menu"
      >
        ☰
      </button>
    </nav>
  );
}
