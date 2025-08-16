import { Router } from 'express';
import UserProfile from '../models/userprofile.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/profiles/me
router.get('/me', auth, async (req, res) => {
  const profile = await UserProfile.findOne({ userId: req.user.id });
  res.json(profile || null);
});

// POST /api/profiles    (create or upsert)
router.post('/', auth, async (req, res) => {
  const { name, email, skills = [], projects = [], github = '' } = req.body;
  if (!name || !email) return res.status(400).json({ message: 'name and email required' });

  const payload = { userId: req.user.id, name, email, skills, projects, github };

  const profile = await UserProfile.findOneAndUpdate(
    { userId: req.user.id },
    payload,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.status(200).json(profile);
});

// PUT /api/profiles/:id   (edit only own profile)
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const profile = await UserProfile.findById(id);
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  if (String(profile.userId) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });

  const allowed = ['name', 'email', 'skills', 'projects', 'github'];
  for (const key of Object.keys(req.body)) {
    if (allowed.includes(key)) profile[key] = req.body[key];
  }
  await profile.save();
  res.json(profile);
});

export default router;