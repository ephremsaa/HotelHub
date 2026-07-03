const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    create: async (name, email, password, role) => {
        const hash = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`;
        const values = [name, email, hash, role || 'customer'];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    findByEmail: async (email) => {
        const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        return result.rows[0];
    },

    findById: async (id) => {
        const result = await db.query(`SELECT id, name, email, role, created_at FROM users WHERE id = $1`, [id]);
        return result.rows[0];
    }
};

module.exports = User;
