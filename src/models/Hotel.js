const db = require('../config/db');

const Hotel = {
    create: async (owner_id, hotel_name, description, address, city, country, phone, email, star_rating, cover_image) => {
        const query = `
            INSERT INTO hotels (owner_id, hotel_name, description, address, city, country, phone, email, star_rating, cover_image)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
        const values = [owner_id, hotel_name, description, address, city, country, phone, email, star_rating, cover_image];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    findAll: async () => {
        const result = await db.query('SELECT * FROM hotels ORDER BY created_at DESC');
        return result.rows;
    },

    findById: async (id) => {
        const result = await db.query('SELECT * FROM hotels WHERE id = $1', [id]);
        return result.rows[0];
    },

    findByOwnerId: async (owner_id) => {
        const result = await db.query('SELECT * FROM hotels WHERE owner_id = $1', [owner_id]);
        return result.rows;
    },

    update: async (id, hotel_name, description, address, city, country, phone, email, star_rating, cover_image) => {
        const query = `
            UPDATE hotels
            SET hotel_name = $1, description = $2, address = $3, city = $4, country = $5, phone = $6, email = $7, star_rating = $8, cover_image = $9
            WHERE id = $10 RETURNING *`;
        const values = [hotel_name, description, address, city, country, phone, email, star_rating, cover_image, id];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    delete: async (id) => {
        const result = await db.query('DELETE FROM hotels WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
};

module.exports = Hotel;
