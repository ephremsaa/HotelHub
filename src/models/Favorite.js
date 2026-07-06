const db = require('../config/db');

const Favorite = {
    add: async (customer_id, hotel_id) => {
        const query = `
            INSERT INTO favorites (customer_id, hotel_id)
            VALUES ($1, $2)
            ON CONFLICT (customer_id, hotel_id) DO NOTHING
            RETURNING *`;
        const result = await db.query(query, [customer_id, hotel_id]);
        return result.rows[0];
    },

    remove: async (customer_id, hotel_id) => {
        const query = `DELETE FROM favorites WHERE customer_id = $1 AND hotel_id = $2 RETURNING *`;
        const result = await db.query(query, [customer_id, hotel_id]);
        return result.rows[0];
    },

    findByCustomerId: async (customer_id) => {
        const query = `
            SELECT f.id as favorite_id, h.*
            FROM favorites f
            JOIN hotels h ON f.hotel_id = h.id
            WHERE f.customer_id = $1
            ORDER BY f.created_at DESC
        `;
        const result = await db.query(query, [customer_id]);
        return result.rows;
    },
    
    checkIfFavorited: async (customer_id, hotel_id) => {
        const query = `SELECT id FROM favorites WHERE customer_id = $1 AND hotel_id = $2`;
        const result = await db.query(query, [customer_id, hotel_id]);
        return result.rows.length > 0;
    }
};

module.exports = Favorite;
