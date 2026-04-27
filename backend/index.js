const express = require('express');
const cors = require('cors');
const db = require('./db');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const aiRoutes = require('./routes/ai');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/orders', orderRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('AgriLink AI Backend is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
