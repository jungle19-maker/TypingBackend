const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cors = require('cors');

const setupSecurity = (app) => {
    // Security Headers
    app.use(helmet());

    // Compress responses
    app.use(compression());

    // Rate Limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.'
    });
    app.use('/api', limiter);

    // CORS
    app.use(cors({
        origin: process.env.CLIENT_URL || '*', // Allow all or specific client
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
};

module.exports = setupSecurity;
