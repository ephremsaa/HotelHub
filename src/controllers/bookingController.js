const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');

exports.createBooking = async (req, res) => {
    try {
        const { hotel_id, room_id, check_in, check_out, total_price } = req.body;
        const newBooking = await Booking.create(req.user.id, hotel_id, room_id, check_in, check_out, total_price);
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating booking' });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findByCustomerId(req.user.id);
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching bookings' });
    }
};

exports.getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelId);
        if (!hotel || (hotel.owner_id !== req.user.id && req.user.role !== 'admin')) {
            return res.status(403).json({ error: 'Not authorized for this hotel' });
        }

        const bookings = await Booking.findByHotelId(req.params.hotelId);
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching hotel bookings' });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        
        const hotel = await Hotel.findById(booking.hotel_id);
        const isOwner = hotel && hotel.owner_id === req.user.id;
        const isAdmin = req.user.role === 'admin';
        const isCustomer = booking.customer_id === req.user.id;
        
        if (!isOwner && !isAdmin && !isCustomer) {
             return res.status(403).json({ error: 'Not authorized' });
        }
        
        if (isCustomer && !isOwner && !isAdmin && status !== 'Cancelled') {
             return res.status(403).json({ error: 'Customers can only cancel their bookings' });
        }

        const updatedBooking = await Booking.updateStatus(req.params.id, status);
        res.json({ message: 'Booking status updated', booking: updatedBooking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error updating booking' });
    }
};
