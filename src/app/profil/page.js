"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/Profil.module.css";

export default function ProfilPage() {
  const router = useRouter();

  const [avatar, setAvatar] = useState("/default-avatar.png");
  const [newPassword, setNewPassword] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      // TODO: Upload vers le serveur si nécessaire
    }
  };

  const handlePasswordUpdate = () => {
    // TODO: appel à une route API pour modifier le mot de passe
    alert("Mot de passe mis à jour !");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Supprimer définitivement le compte ?"
    );
    if (confirmDelete) {
      // TODO: appel API pour supprimer le compte
      localStorage.removeItem("token");
      router.push("/");
    }
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
        <button onClick={handleDeleteAccount} className={styles.deleteButton}>
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}
