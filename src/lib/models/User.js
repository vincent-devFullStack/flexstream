import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  tmdbId: { type: Number, required: true },
  title: String,
  posterPath: String,
  note: Number,
  genre: String,
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: String,
  movies: [mediaSchema],
  series: [mediaSchema],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
