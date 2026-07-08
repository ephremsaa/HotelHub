const db = require('../config/db');

const Booking = {
    create: async (customer_id, hotel_id, room_id, check_in, check_out, total_price, guest_name = null, guest_phone = null) => {
        const query = `
            INSERT INTO bookings (customer_id, hotel_id, room_id, check_in, check_out, total_price, guest_name, guest_phone, booking_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending') RETURNING *`;
        const values = [customer_id, hotel_id, room_id, check_in, check_out, total_price, guest_name, guest_phone];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    findById: async (id) => {
        const result = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
        return result.rows[0];
    },

    findByCustomerId: async (customer_id) => {
        const result = await db.query(`
            SELECT b.*, h.hotel_name, r.room_number, rt.name as room_type_name 
            FROM bookings b
            JOIN hotels h ON b.hotel_id = h.id
            JOIN rooms r ON b.room_id = r.id
            JOIN room_types rt ON r.room_type_id = rt.id
            WHERE b.customer_id = $1
            ORDER BY b.check_in DESC
        `, [customer_id]);
        return result.rows;
    },

    findByHotelId: async (hotel_id) => {
        const result = await db.query(`
            SELECT b.*, COALESCE(u.name, b.guest_name) as customer_name, COALESCE(u.email, 'N/A') as customer_email, COALESCE(u.phone, b.guest_phone) as customer_phone, r.room_number, rt.name as room_type_name
            FROM bookings b
            LEFT JOIN users u ON b.customer_id = u.id
            JOIN rooms r ON b.room_id = r.id
            JOIN room_types rt ON r.room_type_id = rt.id
            WHERE b.hotel_id = $1
            ORDER BY b.check_in DESC
        `, [hotel_id]);
        return result.rows;
    },

    updateStatus: async (id, status) => {
        const result = await db.query('UPDATE bookings SET booking_status = $1 WHERE id = $2 RETURNING *', [status, id]);
        return result.rows[0];
    }
};

module.exports = Booking;
