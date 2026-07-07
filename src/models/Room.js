const db = require('../config/db');

const Room = {
    createRoomType: async (hotel_id, name, description, capacity, price_per_night, beds, bathrooms, image_url) => {
        const query = `
            INSERT INTO room_types (hotel_id, name, description, capacity, price_per_night, beds, bathrooms, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const values = [hotel_id, name, description || '', capacity, price_per_night, beds, bathrooms || 1, image_url || null];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    deleteRoomType: async (id) => {
        await db.query('DELETE FROM room_types WHERE id = $1', [id]);
    },

    updateRoomType: async (id, name, capacity, price_per_night, beds, image_url) => {
        if (image_url) {
            const query = `
                UPDATE room_types 
                SET name = $1, capacity = $2, price_per_night = $3, beds = $4, image_url = $5
                WHERE id = $6 RETURNING *`;
            const result = await db.query(query, [name, capacity, price_per_night, beds, image_url, id]);
            return result.rows[0];
        } else {
            const query = `
                UPDATE room_types 
                SET name = $1, capacity = $2, price_per_night = $3, beds = $4
                WHERE id = $5 RETURNING *`;
            const result = await db.query(query, [name, capacity, price_per_night, beds, id]);
            return result.rows[0];
        }
    },

    getRoomTypesByHotelId: async (hotel_id) => {
        const result = await db.query('SELECT * FROM room_types WHERE hotel_id = $1', [hotel_id]);
        return result.rows;
    },

    createRoom: async (hotel_id, room_type_id, room_number, floor, status) => {
        const query = `
            INSERT INTO rooms (hotel_id, room_type_id, room_number, floor, status)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [hotel_id, room_type_id, room_number, floor, status || 'available'];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    getRoomsByHotelId: async (hotel_id) => {
        const result = await db.query(`
            SELECT r.*, rt.name as room_type_name, rt.price_per_night, rt.image_url 
            FROM rooms r
            JOIN room_types rt ON r.room_type_id = rt.id
            WHERE r.hotel_id = $1
        `, [hotel_id]);
        return result.rows;
    },

    updateRoomStatus: async (id, status) => {
        const result = await db.query('UPDATE rooms SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
        return result.rows[0];
    },

    updateRoom: async (id, room_number, floor, status) => {
        const query = `
            UPDATE rooms 
            SET room_number = $1, floor = $2, status = $3 
            WHERE id = $4 RETURNING *`;
        const result = await db.query(query, [room_number, floor, status, id]);
        return result.rows[0];
    },

    deleteRoom: async (id) => {
        await db.query('DELETE FROM rooms WHERE id = $1', [id]);
    }
};

module.exports = Room;
