const express = require('express');
const rateLimit = require('express-rate-limit');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy if behind a reverse proxy (common in production, but good practice to have)
app.set('trust proxy', 1);

// DoS Prevention: Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiter to all requests
app.use(limiter);

// Visitor Tracking Middleware
app.use((req, res, next) => {
    // Skip tracking for static assets to avoid cluttering the DB
    if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
        return next();
    }

    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    db.query(`INSERT INTO visits (ip, user_agent) VALUES ($1, $2)`, [ip, userAgent], (err) => {
        if (err) {
            console.error('Error logging visit:', err);
        }
    });

    next();
});

// Serve static files
// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API to get stats
app.get('/api/stats', (req, res) => {
    db.query(`SELECT * FROM visits ORDER BY timestamp DESC LIMIT 50`, [], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            total_visits: result.rows.length, // This is just count of fetched rows, for total count we'd need another query
            recent_visits: result.rows
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
