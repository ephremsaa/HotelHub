const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const { authorize } = require('../middleware/auth');
const router = express.Router();

// All favorites routes are protected for customers only
router.post('/', authorize(['customer']), favoriteController.addFavorite);
router.delete('/:hotelId', authorize(['customer']), favoriteController.removeFavorite);
router.get('/', authorize(['customer']), favoriteController.getMyFavorites);
router.get('/status/:hotelId', authorize(['customer']), favoriteController.checkFavoriteStatus);

module.exports = router;
