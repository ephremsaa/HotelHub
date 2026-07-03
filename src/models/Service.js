const db = require('../config/db');

const Service = {
    create: async (provider_id, name, description, duration_minutes, price) => {
        const query = `INSERT INTO services (provider_id, name, description, duration_minutes, price) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [provider_id, name, description, duration_minutes, price];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    findAll: async () => {
        const query = `SELECT s.*, u.name as provider_name FROM services s JOIN users u ON s.provider_id = u.id`;
        const result = await db.query(query);
        return result.rows;
    },
    
    findById: async (id) => {
        const result = await db.query(`SELECT * FROM services WHERE id = $1`, [id]);
        return result.rows[0];
    }
};

module.exports = Service;
