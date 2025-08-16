// models/userprofile.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  { title: String, description: String, link: String },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    github: { type: String, default: "" },
    skills: { type: [String], default: [] },
    projects: { type: [projectSchema], default: [] },
    template: { type: String, enum: ["classic", "cards"], default: "classic" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);   // ✅ CommonJS export
