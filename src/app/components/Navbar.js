"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // récupère le chemin actuel

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/recherche?query=${encodeURIComponent(search.trim())}`);
    }
  };

  const getActiveClass = (path) => (pathname === path ? styles.active : "");

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

      <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={search}
          onChange={handleSearchChange}
        />
        <button type="submit">
          <img src="/icons/search.svg" alt="Search" width={16} height={16} />
        </button>
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
          href="/series"
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
