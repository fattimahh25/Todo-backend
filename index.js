require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

// ===== Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch(err => console.error(err));

// ===== Portfolio Schema =====
const portfolioSchema = new mongoose.Schema({
  name: String,
  email: String,
  github: String,
  skills: [String],
  projects: [{ title: String, description: String, link: String }],
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

// ===== Portfolio Routes =====
// Save portfolio
app.post("/api/portfolio", async (req, res) => {
  try {
    const newPortfolio = new Portfolio(req.body);
    await newPortfolio.save();
    res.json({ success: true, message: "Portfolio saved!", id: newPortfolio._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get portfolio by ID
app.get("/api/portfolio/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ success: false, error: "Portfolio not found" });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
