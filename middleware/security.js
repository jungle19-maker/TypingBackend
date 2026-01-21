const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const setupSecurity = (app) => {
    // Security Headers
    app.use(helmet());

    // Data Sanitization against NoSQL query injection

    app.use((req, res, next) => {
        req.body = mongoSanitize.sanitize(req.body);
        req.params = mongoSanitize.sanitize(req.params);
        if (req.query) {
            mongoSanitize.sanitize(req.query);
        }
        next();
    });

    // Prevent Parameter Pollution
    app.use(hpp());

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
        origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', process.env.CLIENT_URL],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
        credentials: true
    }));
};

module.exports = setupSecurity;
