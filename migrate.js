const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function migrate() {
    try {
        await pool.query('ALTER TABLE bookings ALTER COLUMN customer_id DROP NOT NULL;');
        await pool.query('ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_name VARCHAR(255);');
        await pool.query('ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_phone VARCHAR(50);');
        console.log('Migration successful');
    } catch(e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
migrate();
