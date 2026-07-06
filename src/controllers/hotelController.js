const Hotel = require('../models/Hotel');

exports.createHotel = async (req, res) => {
    try {
        if (req.user.role !== 'hotel_owner') {
            return res.status(403).json({ error: 'Only hotel owners can create hotels' });
        }
        let { hotel_name, description, address, city, country, phone, email, star_rating, cover_image } = req.body;
        if (req.file) {
            cover_image = '/uploads/' + req.file.filename;
        }
        const newHotel = await Hotel.create(req.user.id, hotel_name, description, address, city, country, phone, email, star_rating, cover_image);
        res.status(201).json({ message: 'Hotel created successfully', hotel: newHotel });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating hotel' });
    }
};

exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.findAll();
        res.json(hotels);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching hotels' });
    }
};

exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
        res.json(hotel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching hotel' });
    }
};

exports.updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

        if (hotel.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to update this hotel' });
        }

        let { hotel_name, description, address, city, country, phone, email, star_rating, cover_image } = req.body;
        if (req.file) {
            cover_image = '/uploads/' + req.file.filename;
        } else if (!cover_image) {
            cover_image = hotel.cover_image;
        }
        
        const updatedHotel = await Hotel.update(req.params.id, hotel_name, description, address, city, country, phone, email, star_rating, cover_image);
        res.json({ message: 'Hotel updated successfully', hotel: updatedHotel });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error updating hotel' });
    }
};

exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

        if (hotel.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this hotel' });
        }

        await Hotel.delete(req.params.id);
        res.json({ message: 'Hotel deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error deleting hotel' });
    }
};
