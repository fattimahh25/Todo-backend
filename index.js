require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos'); 

const app = express();
const PORT = process.env.PORT || 5000; // Store port in a variable

app.use(cors());
app.use(express.json());

console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

app.use('/api/auth/', authRoutes);
app.use('/api/todos/', todoRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error(err));
