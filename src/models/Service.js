const db = require('../config/db');

const Service = {
    create: (provider_id, name, description, duration_minutes, price) => {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare(`INSERT INTO services (provider_id, name, description, duration_minutes, price) VALUES (?, ?, ?, ?, ?)`);
            stmt.run([provider_id, name, description, duration_minutes, price], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, provider_id, name, description, duration_minutes, price });
            });
            stmt.finalize();
        });
    },

    findAll: () => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT s.*, u.name as provider_name FROM services s JOIN users u ON s.provider_id = u.id`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    
    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM services WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

module.exports = Service;
