const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const hotelController = require('../controllers/hotelController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads/'));
    },
    filename: function(req, file, cb) {
        cb(null, 'hotel-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});
const validateHotel = [
    body('hotel_name').notEmpty().withMessage('Hotel name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

const cpUpload = upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'pool_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 }
]);

router.get('/', hotelController.getHotels);
router.get('/:id', hotelController.getHotelById);
router.post('/', authorize(['hotel_owner']), cpUpload, validateHotel, hotelController.createHotel);
router.put('/:id', authorize(['hotel_owner', 'admin']), cpUpload, validateHotel, hotelController.updateHotel);
router.delete('/:id', authorize(['hotel_owner', 'admin']), hotelController.deleteHotel);
router.delete('/gallery/:imageId', authorize(['hotel_owner', 'admin']), hotelController.deleteGalleryImage);

module.exports = router;
