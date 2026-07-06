const db = require('../config/db');

const Room = {
    createRoomType: async (hotel_id, name, description, capacity, price_per_night, beds, bathrooms) => {
        const query = `
            INSERT INTO room_types (hotel_id, name, description, capacity, price_per_night, beds, bathrooms)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        const values = [hotel_id, name, description || '', capacity, price_per_night, beds, bathrooms || 1];
        const result = await db.query(query, values);
        return result.rows[0];
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
            SELECT r.*, rt.name as room_type_name, rt.price_per_night 
            FROM rooms r
            JOIN room_types rt ON r.room_type_id = rt.id
            WHERE r.hotel_id = $1
        `, [hotel_id]);
        return result.rows;
    },

    updateRoomStatus: async (id, status) => {
        const result = await db.query('UPDATE rooms SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
        return result.rows[0];
    }
};

module.exports = Room;
