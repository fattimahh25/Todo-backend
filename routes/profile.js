// routes/profile.js
const express = require("express");
const Profile = require("../models/userprofile.js");
const { auth } = require("../middleware/auth.js");

const router = express.Router();

// Get my profile
router.get("/me", auth, async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user.id });
  res.json(profile || null);
});

// Create/Update (upsert) my profile
router.post("/", auth, async (req, res) => {
  const { name, email, github = "", skills = [], projects = [], template = "classic", theme = "light" } = req.body;
  if (!name || !email) return res.status(400).json({ message: "name and email required" });

  const payload = { userId: req.user.id, name, email, github, skills, projects, template, theme };
  const profile = await Profile.findOneAndUpdate(
    { userId: req.user.id },
    payload,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(profile);
});

// Update by id (ownership enforced)
router.put("/:id", auth, async (req, res) => {
  const p = await Profile.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Profile not found" });
  if (String(p.userId) !== String(req.user.id)) return res.status(403).json({ message: "Forbidden" });

  const allowed = ["name", "email", "github", "skills", "projects", "template", "theme"];
  for (const key of Object.keys(req.body)) if (allowed.includes(key)) p[key] = req.body[key];
  await p.save();
  res.json(p);
});

module.exports = router;   // ✅ CommonJS export
