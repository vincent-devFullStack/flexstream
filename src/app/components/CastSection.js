"use client";

import React, { useRef } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export default function CastSection({ cast = [] }) {
  const scrollRef = useRef(null);

  if (!cast.length) return null;

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div style={{ marginTop: "2rem", position: "relative" }}>
      <h3 style={{ marginBottom: "0.5rem" }}>Têtes d'affiche</h3>

      <button
        onClick={() => scroll("left")}
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          background: "rgba(0, 0, 0, 0.5)",
          border: "none",
          borderRadius: "50%",
          padding: "0.5rem",
          cursor: "pointer",
        }}
      >
        <BiChevronLeft size={24} color="#fff" />
      </button>

      <button
        onClick={() => scroll("right")}
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          background: "rgba(0, 0, 0, 0.5)",
          border: "none",
          borderRadius: "50%",
          padding: "0.5rem",
          cursor: "pointer",
        }}
      >
        <BiChevronRight size={24} color="#fff" />
      </button>

      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "1rem",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="hide-scrollbar"
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
                borderRadius: "8px",
                objectFit: "cover",
                height: "120px",
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
