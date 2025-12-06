const GalleryImage = require('../models/GalleryImage');
const { uploadToCloudinary, uploadThumbnailToCloudinary } = require('../config/cloudinary');

// @desc    Get paginated gallery images
// @route   GET /api/gallery
// @access  Public
const getGalleryImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const skip = (page - 1) * limit;

    const images = await GalleryImage.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await GalleryImage.countDocuments();

    res.json({
      images,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalImages: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload gallery image(s)
// @route   POST /api/gallery
// @access  Private/Admin
const uploadGalleryImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      // Upload full image
      const result = await uploadToCloudinary(file.buffer, 'royalroofworks/gallery');
      
      // Upload thumbnail
      const thumbnailResult = await uploadToCloudinary(file.buffer, 'royalroofworks/gallery/thumbnails');

      const image = await GalleryImage.create({
        url: result.secure_url,
        thumbnailUrl: thumbnailResult.secure_url,
        publicId: result.public_id,
        alt: file.originalname || 'Roofing work image',
        uploadedBy: req.admin?.username || 'admin',
      });

      uploadedImages.push(image);
    }

    res.status(201).json({
      message: 'Images uploaded successfully',
      images: uploadedImages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryImage = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete from Cloudinary (optional - can be done via Cloudinary API)
    await GalleryImage.findByIdAndDelete(req.params.id);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGalleryImages,
  uploadGalleryImages,
  deleteGalleryImage,
};

