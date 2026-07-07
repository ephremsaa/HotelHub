const Hotel = require('../models/Hotel');

exports.createHotel = async (req, res) => {
    try {
        if (req.user.role !== 'hotel_owner') {
            return res.status(403).json({ error: 'Only hotel owners can create hotels' });
        }
        let { hotel_name, description, address, city, country, phone, email, star_rating, base_price, amenities } = req.body;
        let cover_image = null;
        let pool_image_url = null;
        const files = req.files || {};
        
        if (files['cover_image']) {
            cover_image = '/uploads/' + files['cover_image'][0].filename;
        }
        if (files['pool_image']) {
            pool_image_url = '/uploads/' + files['pool_image'][0].filename;
        }
        
        const newHotel = await Hotel.create(req.user.id, hotel_name, description, address, city, country, phone, email, star_rating, base_price, cover_image, pool_image_url);
        
        if (files['gallery_images']) {
            const galleryUrls = files['gallery_images'].map(f => '/uploads/' + f.filename);
            await Hotel.setGalleryImages(newHotel.id, galleryUrls);
        }
        if (amenities) {
            try {
                const parsedAmenities = JSON.parse(amenities);
                await Hotel.setAmenities(newHotel.id, parsedAmenities);
            } catch(e) {
                console.error("Failed to parse amenities", e);
            }
        }

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

        let { hotel_name, description, address, city, country, phone, email, star_rating, base_price, amenities } = req.body;
        const files = req.files || {};
        
        let cover_image = hotel.cover_image;
        if (files['cover_image']) {
            cover_image = '/uploads/' + files['cover_image'][0].filename;
        }
        
        let pool_image_url = hotel.pool_image_url;
        if (files['pool_image']) {
            pool_image_url = '/uploads/' + files['pool_image'][0].filename;
        }
        
        const updatedHotel = await Hotel.update(req.params.id, hotel_name, description, address, city, country, phone, email, star_rating, base_price, cover_image, pool_image_url);
        
        if (files['gallery_images']) {
            const galleryUrls = files['gallery_images'].map(f => '/uploads/' + f.filename);
            // Append gallery images, don't delete old ones
            await Hotel.setGalleryImages(updatedHotel.id, galleryUrls);
        }
        if (amenities) {
            try {
                const parsedAmenities = JSON.parse(amenities);
                await Hotel.setAmenities(updatedHotel.id, parsedAmenities);
            } catch(e) {
                console.error("Failed to parse amenities", e);
            }
        }

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

exports.deleteGalleryImage = async (req, res) => {
    try {
        const imageId = req.params.imageId;
        await Hotel.deleteGalleryImage(imageId);
        res.json({ message: 'Gallery image deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error deleting gallery image' });
    }
};
