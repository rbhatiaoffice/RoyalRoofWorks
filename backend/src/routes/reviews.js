const express = require('express');
const router = express.Router();
const {
  getReviews,
  getAllReviews,
  submitReview,
  approveReview,
  deleteReview,
} = require('../controllers/reviewsController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', getReviews);
router.get('/all', protect, getAllReviews);
router.post('/', upload.array('images', 5), submitReview);
router.put('/:id/approve', protect, approveReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;

