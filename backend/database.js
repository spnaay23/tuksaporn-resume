const { Pool } = require('pg');

// Use DATABASE_URL from environment variables
// Default to a local connection string if not provided (for local testing)
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/visitors_db';

const pool = new Pool({
    connectionString: connectionString,
    // SSL is usually required for cloud deployments like Render
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database table
const initDb = async () => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS visits (
            id SERIAL PRIMARY KEY,
            ip TEXT,
            user_agent TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        console.log('Connected to PostgreSQL and ensured table exists');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initDb();

module.exports = pool;
