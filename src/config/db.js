const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Connected to the PostgreSQL database.');
        
        // Initialize the database with schema.sql
        const schemaPath = path.resolve(__dirname, '../../schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        
        client.query(schema, (err, result) => {
            release();
            if (err) {
                console.error('Error executing schema', err.stack);
            } else {
                console.log('Database schema initialized.');
            }
        });
    }
});

module.exports = pool;
