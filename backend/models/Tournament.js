 import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  joinedAt: { type: Date, default: Date.now }
});

const tournamentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },

  entry: { type: Number, required: true, min: 0 },
  prize: { type: Number, default: 0 },

  totalSlots: { type: Number, required: true, min: 1 },
  filledSlots: { type: Number, default: 0 },

  mode: {
    type: String,
    enum: ["Solo", "Duo", "Squad"],
    required: true
  },

  img: { type: String, default: "" },

  players: [playerSchema],

  isFull: {
    type: Boolean,
    default: false
  },

  createdAt: { type: Date, default: Date.now }
});

const Tournament = mongoose.model("Tournament", tournamentSchema);
export default Tournament;