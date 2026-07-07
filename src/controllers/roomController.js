const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

exports.createRoomType = async (req, res) => {
    try {
        const { hotel_id, name, description, capacity, price_per_night, beds, bathrooms } = req.body;
        
        const hotel = await Hotel.findById(hotel_id);
        if (!hotel || (hotel.owner_id !== req.user.id && req.user.role !== 'admin')) {
            return res.status(403).json({ error: 'Not authorized for this hotel' });
        }

        let image_url = null;
        if (req.file) {
            image_url = '/uploads/' + req.file.filename;
        }

        const roomType = await Room.createRoomType(hotel_id, name, description, capacity, price_per_night, beds, bathrooms, image_url);
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

exports.getRoomTypesByHotel = async (req, res) => {
    try {
        const types = await Room.getRoomTypesByHotelId(req.params.hotelId);
        res.json(types);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching room types' });
    }
};

exports.deleteRoomType = async (req, res) => {
    try {
        await Room.deleteRoomType(req.params.id);
        res.json({ message: 'Room type deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error deleting room type' });
    }
};

exports.updateRoomType = async (req, res) => {
    try {
        const { name, capacity, price_per_night, beds } = req.body;
        let image_url = null;
        if (req.file) {
            image_url = '/uploads/' + req.file.filename;
        }
        
        const roomType = await Room.updateRoomType(req.params.id, name, capacity, price_per_night, beds, image_url);
        res.json({ message: 'Room type updated', roomType });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error updating room type' });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const { room_number, floor, status } = req.body;
        const room = await Room.updateRoom(req.params.id, room_number, floor, status);
        res.json({ message: 'Room updated', room });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error updating room' });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        await Room.deleteRoom(req.params.id);
        res.json({ message: 'Room deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error deleting room' });
    }
};
