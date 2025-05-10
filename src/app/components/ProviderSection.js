"use client";

import React from "react";

export default function ProviderSection({ title, providers = [] }) {
  if (!providers.length) return null;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h4 style={{ marginBottom: "0.5rem" }}>{title} :</h4>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {providers.map((p) => (
          <a
            key={p.provider_id}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
              alt={p.provider_name}
              title={p.provider_name}
              style={{
                backgroundColor: "white",
                borderRadius: "6px",
                padding: "4px",
              }}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
