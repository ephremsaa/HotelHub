const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    create: async (name, email, password, role) => {
        const hash = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            const stmt = db.prepare(`INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`);
            stmt.run([name, email, hash, role || 'customer'], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, name, email, role: role || 'customer' });
            });
            stmt.finalize();
        });
    },

    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT id, name, email, role, created_at FROM users WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

module.exports = User;
