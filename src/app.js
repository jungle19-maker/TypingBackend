const express = require('express');
const setupSecurity = require('./middlewares/security.middleware');
const { errorHandler } = require('./middlewares/error.middleware');

// Routes
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const typingRoutes = require('./modules/typing/typing.routes');
const examRoutes = require('./modules/exam/exam.routes');

const app = express();

// Security and Standard Middleware
setupSecurity(app);
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // User Management + Plans
app.use('/api/typing', typingRoutes); // Typing + Results + Content
app.use('/api/exams', examRoutes);
// app.use('/api/admin', adminRoutes); // Deprecated/merged into user and typing modules

// Error Handling
app.use(errorHandler);

module.exports = app;
