const express = require('express');
const router = express.Router();
const {
  getGalleryImages,
  uploadGalleryImages,
  deleteGalleryImage,
} = require('../controllers/galleryController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', getGalleryImages);
router.post('/', protect, upload.array('images', 10), uploadGalleryImages);
router.delete('/:id', protect, deleteGalleryImage);

module.exports = router;

