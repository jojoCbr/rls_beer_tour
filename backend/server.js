const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const barRoutes = require('./src/routes/barRoutes');
const beerRoutes = require('./src/routes/beerRoutes');
const beerLogRoutes = require('./src/routes/beerLogRoutes');
const rankingRoutes = require('./src/routes/rankingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Temporary JWT_SECRET for development. Should be loaded from .env in production.
process.env.JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Beer App Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/bars', barRoutes);
app.use('/api/beers', beerRoutes);
app.use('/api/beerlogs', beerLogRoutes);
app.use('/api/rankings', rankingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
