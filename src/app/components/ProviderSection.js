"use client";

export default function ProviderSection({ title, providers = [] }) {
  if (!providers.length) return null;

  return (
    <section style={{ marginTop: "1rem" }}>
      <h4 style={{ marginBottom: "0.5rem" }}>{title} :</h4>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {providers.map((provider) => (
          <a
            key={provider.provider_id}
            href={provider.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Voir ${provider.provider_name} pour ce contenu`}
          >
            <img
              src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
              alt={`Logo ${provider.provider_name}`}
              title={provider.provider_name}
              style={{
                backgroundColor: "#fff",
                borderRadius: "6px",
                padding: "4px",
                width: "45px",
                height: "45px",
                objectFit: "contain",
              }}
            />
          </a>
        ))}
      </div>
    </section>
  );
}
