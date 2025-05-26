"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/Login.module.css";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Login failed");
    } else {
      localStorage.setItem("token", data.token);
      router.push("/"); // ou "/dashboard" selon ta logique
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/" className={styles.back}>
          ← Back to Home
        </Link>

        <h2 className={styles.title}>Login</h2>
        <p className={styles.subtitle}>
          Enter your email below to login to your account
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Email
            <input
              type="email"
              placeholder="m@example.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <div className={styles.row}>
            <label className={styles.label}>Password</label>
            <Link href="#" className={styles.link}>
              Forgot your password?
            </Link>
          </div>

          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className={styles.button}>
            Login
          </button>
          <button type="button" className={styles.buttonOutline}>
            Login with Google
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "1rem", color: "#f88" }}>{message}</p>
        )}

        <p className={styles.footer}>
          Don’t have an account?{" "}
          <Link href="/signup" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
