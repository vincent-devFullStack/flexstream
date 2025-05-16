"use client";

import { useRef } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export default function CastSection({ cast = [] }) {
  const scrollRef = useRef(null);

  if (!cast.length) return null;

  const scrollByDirection = (dir) => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div style={{ marginTop: "2rem", position: "relative" }}>
      <h3 style={{ marginBottom: "0.5rem" }}>Têtes d'affiche</h3>

      {/* Bouton gauche */}
      <ScrollButton direction="left" onClick={scrollByDirection} />

      {/* Bouton droit */}
      <ScrollButton direction="right" onClick={scrollByDirection} />

      <div
        ref={scrollRef}
        className="hide-scrollbar"
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "1rem",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {cast.map((actor) => (
          <div key={actor.id} style={{ textAlign: "center", width: "120px" }}>
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                  : "/placeholder.jpg"
              }
              alt={actor.name}
              style={{
                width: "100px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "0.5rem",
              }}
            />
            <strong style={{ fontSize: "1rem" }}>{actor.name}</strong>
            <p style={{ fontSize: "0.8rem", color: "#888", margin: 0 }}>
              {actor.character}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScrollButton({ direction, onClick }) {
  const isLeft = direction === "left";
  const Icon = isLeft ? BiChevronLeft : BiChevronRight;

  return (
    <button
      onClick={() => onClick(direction)}
      aria-label={`Faire défiler vers la ${isLeft ? "gauche" : "droite"}`}
      style={{
        position: "absolute",
        top: "50%",
        [isLeft ? "left" : "right"]: 0,
        transform: "translateY(-50%)",
        zIndex: 1,
        background: "rgba(0, 0, 0, 0.5)",
        border: "none",
        borderRadius: "50%",
        padding: "0.5rem",
        cursor: "pointer",
      }}
    >
      <Icon size={24} color="#fff" />
    </button>
  );
}
