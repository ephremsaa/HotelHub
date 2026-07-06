const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

exports.createRoomType = async (req, res) => {
    try {
        const { hotel_id, name, description, capacity, price_per_night, beds, bathrooms } = req.body;
        
        const hotel = await Hotel.findById(hotel_id);
        if (!hotel || (hotel.owner_id !== req.user.id && req.user.role !== 'admin')) {
            return res.status(403).json({ error: 'Not authorized for this hotel' });
        }

        const roomType = await Room.createRoomType(hotel_id, name, description, capacity, price_per_night, beds, bathrooms);
        res.status(201).json({ message: 'Room type created', roomType });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating room type: ' + err.message });
    }
};

exports.createRoom = async (req, res) => {
    try {
        const { hotel_id, room_type_id, room_number, floor, status } = req.body;

        const hotel = await Hotel.findById(hotel_id);
        if (!hotel || (hotel.owner_id !== req.user.id && req.user.role !== 'admin')) {
            return res.status(403).json({ error: 'Not authorized for this hotel' });
        }

        const room = await Room.createRoom(hotel_id, room_type_id, room_number, floor, status);
        res.status(201).json({ message: 'Room created', room });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating room' });
    }
};

exports.getRoomsByHotel = async (req, res) => {
    try {
        const rooms = await Room.getRoomsByHotelId(req.params.hotelId);
        res.json(rooms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching rooms' });
    }
};

exports.updateRoomStatus = async (req, res) => {
    try {
        const { status } = req.body;
        // Basic authorization check could be added here similar to createRoom
        const room = await Room.updateRoomStatus(req.params.id, status);
        res.json({ message: 'Room status updated', room });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error updating room status' });
    }
};
