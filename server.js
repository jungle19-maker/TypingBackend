const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const setupSecurity = require('./middleware/security');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

// Security Middleware (Helmet, CORS, Rate Limit, Compression)
setupSecurity(app);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const resultRoutes = require('./routes/resultRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/results', resultRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
