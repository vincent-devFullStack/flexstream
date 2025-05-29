"use client";

import { useState } from "react";
import styles from "../styles/AuthModal.module.css";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login");
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.close}>
          &times;
        </button>
        <h2 className={styles.title}>
          {mode === "login" ? "Connexion" : "Inscription"}
        </h2>

        {mode === "login" ? (
          <LoginForm onSwitch={() => setMode("signup")} />
        ) : (
          <SignupForm onSwitch={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}

function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Login failed");
    } else {
      localStorage.setItem("token", data.token);
      window.location.reload();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className={styles.input}
      />
      <button type="submit" className={styles.submit}>
        Se connecter
      </button>
      {message && <p className={styles.error}>{message}</p>}
      <p className={styles.switch}>
        Pas encore inscrit ?{" "}
        <button type="button" onClick={onSwitch}>
          Créer un compte
        </button>
      </p>
    </form>
  );
}

function SignupForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Erreur lors de l'inscription");
    } else {
      setMessage("Compte créé ! Vous pouvez vous connecter.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Confirmez le mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className={styles.input}
      />
      <button type="submit" className={styles.submit}>
        S'inscrire
      </button>
      {message && <p className={styles.error}>{message}</p>}
      <p className={styles.switch}>
        Déjà inscrit ?{" "}
        <button type="button" onClick={onSwitch}>
          Se connecter
        </button>
      </p>
    </form>
  );
}
