import styles from "../styles/Movie.module.css";

export default function Movie({ title, description }) {
  return (
    <div className={styles.vignette}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
