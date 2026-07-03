const db = require('../config/db');

const Appointment = {
    create: async (customer_id, service_id, appointment_date) => {
        const query = `INSERT INTO appointments (customer_id, service_id, appointment_date) VALUES ($1, $2, $3) RETURNING *`;
        const values = [customer_id, service_id, appointment_date];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    findByCustomer: async (customer_id) => {
        const query = `
            SELECT a.*, s.name as service_name, s.price, u.name as provider_name 
            FROM appointments a 
            JOIN services s ON a.service_id = s.id 
            JOIN users u ON s.provider_id = u.id 
            WHERE a.customer_id = $1
            ORDER BY a.appointment_date DESC`;
        const result = await db.query(query, [customer_id]);
        return result.rows;
    },

    findByProvider: async (provider_id) => {
         const query = `
            SELECT a.*, s.name as service_name, u.name as customer_name 
            FROM appointments a 
            JOIN services s ON a.service_id = s.id 
            JOIN users u ON a.customer_id = u.id 
            WHERE s.provider_id = $1
            ORDER BY a.appointment_date ASC`;
        const result = await db.query(query, [provider_id]);
        return result.rows;
    },

    updateStatus: async (id, status) => {
        const result = await db.query(`UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
        return result.rowCount;
    }
};

module.exports = Appointment;
