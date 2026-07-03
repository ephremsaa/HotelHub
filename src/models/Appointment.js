const db = require('../config/db');

const Appointment = {
    create: (customer_id, service_id, appointment_date) => {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare(`INSERT INTO appointments (customer_id, service_id, appointment_date) VALUES (?, ?, ?)`);
            stmt.run([customer_id, service_id, appointment_date], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, customer_id, service_id, appointment_date, status: 'pending' });
            });
            stmt.finalize();
        });
    },

    findByCustomer: (customer_id) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT a.*, s.name as service_name, s.price, u.name as provider_name 
                FROM appointments a 
                JOIN services s ON a.service_id = s.id 
                JOIN users u ON s.provider_id = u.id 
                WHERE a.customer_id = ?
                ORDER BY a.appointment_date DESC`;
            db.all(query, [customer_id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findByProvider: (provider_id) => {
         return new Promise((resolve, reject) => {
            const query = `
                SELECT a.*, s.name as service_name, u.name as customer_name 
                FROM appointments a 
                JOIN services s ON a.service_id = s.id 
                JOIN users u ON a.customer_id = u.id 
                WHERE s.provider_id = ?
                ORDER BY a.appointment_date ASC`;
            db.all(query, [provider_id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    updateStatus: (id, status) => {
         return new Promise((resolve, reject) => {
            db.run(`UPDATE appointments SET status = ? WHERE id = ?`, [status, id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }
};

module.exports = Appointment;
