"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/Profil.module.css";

export default function ProfilPage() {
  const router = useRouter();
  const [avatar, setAvatar] = useState("/default-avatar.png");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/user/profile", {
      headers: { token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.avatar) {
          setAvatar(data.avatar);
        }
      });
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setAvatar(base64);

      const res = await fetch("/api/user/upload-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({ avatar: base64 }),
      });

      if (!res.ok) {
        alert("Erreur lors du changement d'avatar");
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!newPassword || newPassword.length < 6) {
      alert("Mot de passe trop court (min 6 caractères)");
      return;
    }

    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({ newPassword }),
    });

    if (res.ok) {
      alert("Mot de passe mis à jour !");
      setNewPassword("");
    } else {
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Supprimer définitivement le compte ?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    const res = await fetch("/api/user/delete", {
      method: "DELETE",
      headers: { token },
    });

    if (res.ok) {
      localStorage.removeItem("token");
      router.push("/");
    } else {
      alert("Erreur lors de la suppression du compte.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mon Profil</h1>

      <div className={styles.section}>
        <img src={avatar} alt="Avatar" className={styles.avatar} />
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      <div className={styles.section}>
        <h3>Modifier mon mot de passe</h3>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={styles.input}
        />
        <button onClick={handlePasswordUpdate} className={styles.button}>
          Mettre à jour
        </button>
      </div>

      <div className={styles.section}>
        <button
          onClick={() => router.push("/")}
          className={styles.secondaryButton}
        >
          Retour à l'accueil
        </button>
        <button onClick={handleLogout} className={styles.secondaryButton}>
          Déconnexion
        </button>
        <button onClick={handleDeleteAccount} className={styles.deleteButton}>
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}
