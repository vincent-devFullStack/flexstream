"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "../styles/Navbar.module.css";
import { jwtDecode } from "jwt-decode";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const isActive = (path) => (pathname === path ? styles.active : "");

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setAvatar(null);
    setShowDropdown(false);
    setMenuOpen(false);
    router.push("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userTag = `user#${decoded.userId.slice(-4)}`;
      setUser({ ...decoded, tag: userTag });

      fetch("/api/user/profile", { headers: { token } })
        .then((res) => res.json())
        .then((data) => {
          if (data?.user?.avatar) setAvatar(data.user.avatar);
        });
    } catch (err) {
      console.error("Token invalide :", err);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          { signal: controller.signal }
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
          console.error("Erreur suggestions :", err);
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
      <Link href="/" className={styles.logo}>
        <span className={styles.logoText}>
          <span className={styles.flex}>Flex</span>
          <span className={styles.stream}>Stream</span>
        </span>
      </Link>

      <button
        className={`${styles.burger} ${menuOpen ? styles.active : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span></span>
      </button>

      <div
        className={`${styles.navLinksWrapper} ${menuOpen ? styles.open : ""}`}
      >
        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) {
                router.push(
                  `/recherche?query=${encodeURIComponent(search.trim())}`
                );
                setSuggestions([]);
                setMenuOpen(false);
              }
            }}
            className={styles.searchBar}
            ref={searchRef}
          >
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">🔍</button>
            {suggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {suggestions.map((item) => (
                  <li key={`${item.type}-${item.id}`}>
                    <Link
                      href={`/${item.type === "tv" ? "serie" : "film"}/$${
                        item.id
                      }`}
                    >
                      <img
                        src={
                          item.poster_path
                            ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                            : "/placeholder.jpg"
                        }
                        alt=""
                        style={{ width: 50, height: 75, objectFit: "cover" }}
                      />
                      <div>
                        <span>{item.title}</span>
                        <span>⭐ {item.vote_average?.toFixed(1)}</span>
                        <span>
                          {item.type === "tv" ? "📺 Série" : "🎬 Film"}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </form>

          <Link href="/" className={isActive("/")}>
            Accueil
          </Link>
          {user && (
            <>
              <Link href="/film" className={isActive("/film")}>
                Films
              </Link>
              <Link href="/serie" className={isActive("/serie")}>
                Séries
              </Link>
              {menuOpen && (
                <div
                  className={`${styles.navLinksSection} ${styles.mobileOnly}`}
                >
                  <Link href="/profil" className={styles.dropdownItem}>
                    Mon profil
                  </Link>
                </div>
              )}
            </>
          )}
          {!user && menuOpen && (
            <button
              className={styles.signIn}
              onClick={() => {
                setShowAuthModal(true);
                setMenuOpen(false);
              }}
            >
              Connexion
            </button>
          )}
        </div>
      </div>

      <div className={styles.userActions}>
        {user ? (
          <div className={styles.userActions} ref={dropdownRef}>
            <div
              className={styles.userWrapper}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className={styles.avatarWithName}>
                {avatar ? (
                  <img
                    src={avatar}
                    alt="avatar"
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarCircle}>
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className={styles.userTag}>{user.tag}</span>
              </div>
              {showDropdown && (
                <div className={styles.dropdown}>
                  <Link href="/profil" className={styles.dropdownItem}>
                    Mon profil
                  </Link>
                  <button onClick={logout} className={styles.dropdownItem}>
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`${styles.userActions} ${styles.desktopOnly}`}>
            <button
              className={styles.signIn}
              onClick={() => setShowAuthModal(true)}
            >
              Connexion
            </button>
          </div>
        )}
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </nav>
  );
}
