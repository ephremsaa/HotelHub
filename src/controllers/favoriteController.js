const Favorite = require('../models/Favorite');
const Hotel = require('../models/Hotel');

exports.addFavorite = async (req, res) => {
    try {
        const { hotel_id } = req.body;
        if (!hotel_id) return res.status(400).json({ error: 'Hotel ID is required' });

        const hotel = await Hotel.findById(hotel_id);
        if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

        await Favorite.add(req.user.id, hotel_id);
        res.status(201).json({ message: 'Hotel added to favorites' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error adding favorite' });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const hotel_id = req.params.hotelId;
        await Favorite.remove(req.user.id, hotel_id);
        res.json({ message: 'Hotel removed from favorites' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error removing favorite' });
    }
};

exports.getMyFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.findByCustomerId(req.user.id);
        res.json(favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching favorites' });
    }
};

exports.checkFavoriteStatus = async (req, res) => {
    try {
        const isFavorited = await Favorite.checkIfFavorited(req.user.id, req.params.hotelId);
        res.json({ isFavorited });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error checking favorite status' });
    }
};
