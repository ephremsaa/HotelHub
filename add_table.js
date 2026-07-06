const fs = require('fs');
const path = require('path');
const db = require('./src/config/db');

async function addFavoritesTable() {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS favorites (
                id SERIAL PRIMARY KEY,
                customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                hotel_id INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(customer_id, hotel_id)
            );
        `;
        await db.query(query);
        console.log('Favorites table added successfully');
        
        // Also update schema.sql
        const schemaPath = path.resolve(__dirname, 'schema.sql');
        let schema = fs.readFileSync(schemaPath, 'utf-8');
        if (!schema.includes('CREATE TABLE favorites')) {
            schema += '\n\n' + query.trim() + '\n';
            fs.writeFileSync(schemaPath, schema);
            console.log('schema.sql updated');
        }
    } catch(err) {
        console.error('Error:', err);
    } finally {
        process.exit(0);
    }
}
addFavoritesTable();
