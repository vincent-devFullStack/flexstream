"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/Profil.module.css";

export default function ProfilPage() {
  const router = useRouter();
  const [avatar, setAvatar] = useState("/default-avatar.png");
  const [newAvatar, setNewAvatar] = useState(null);
  const [avatarSaved, setAvatarSaved] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/profile", {
          headers: { token },
        });
        const data = await res.json();
        if (res.ok && data?.user) {
          setUser(data.user);
          if (data.user.avatar) {
            setAvatar(data.user.avatar);
          }
        }
      } catch {
        // Erreur silencieuse pour la prod
      }
    };

    fetchUser();
  }, []);

  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewAvatar(reader.result);
      setAvatarSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    if (!newAvatar) return;

    const res = await fetch("/api/user/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({ action: "upload-avatar", avatar: newAvatar }),
    });

    if (res.ok) {
      setAvatar(newAvatar);
      setNewAvatar(null);
      setAvatarSaved(true);
      setTimeout(() => setAvatarSaved(false), 3000);
    } else {
      alert("Erreur lors du changement d'avatar");
    }
  };

  const handlePasswordUpdate = async () => {
    const token = localStorage.getItem("token");

    if (!newPassword || newPassword.length < 6) {
      alert("Mot de passe trop court (min 6 caractères)");
      return;
    }

    const confirm = window.confirm(
      "Confirmer la mise à jour du mot de passe ?"
    );
    if (!confirm) return;

    const res = await fetch("/api/user/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ action: "change-password", newPassword }),
    });

    if (res.ok) {
      setNewPassword("");
      setPasswordUpdated(true);
      setTimeout(() => setPasswordUpdated(false), 3000);
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

    const res = await fetch("/api/user/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ action: "delete-account" }),
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
        <img src={newAvatar || avatar} alt="Avatar" className={styles.avatar} />
        <input type="file" accept="image/*" onChange={handleAvatarFile} />
        <button
          className={avatarSaved ? styles.successButton : styles.button}
          onClick={handleAvatarUpload}
        >
          {avatarSaved ? "Image mise à jour !" : "Valider l'image"}
        </button>
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
        <button
          onClick={handlePasswordUpdate}
          className={passwordUpdated ? styles.successButton : styles.button}
        >
          {passwordUpdated ? "Mot de passe mis à jour !" : "Mettre à jour"}
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
