const Review = require('../models/Review');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Get paginated reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Only show approved reviews to public
    const reviews = await Review.find({ approved: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ approved: true });

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/all
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments();

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit review
// @route   POST /api/reviews
// @access  Public
const submitReview = async (req, res) => {
  try {
    const { name, rating, text } = req.body;

    if (!name || !rating || !text) {
      return res.status(400).json({ message: 'Name, rating, and text are required' });
    }

    const reviewImages = [];

    // Upload images if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'royalroofworks/reviews');
        const thumbnailResult = await uploadToCloudinary(file.buffer, 'royalroofworks/reviews/thumbnails');
        
        reviewImages.push({
          url: result.secure_url,
          thumbnailUrl: thumbnailResult.secure_url,
        });
      }
    }

    const review = await Review.create({
      name,
      rating: parseInt(rating),
      text,
      images: reviewImages,
      approved: false, // Requires admin approval
    });

    res.status(201).json({
      message: 'Review submitted successfully. It will be reviewed before publishing.',
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve review
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review approved', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReviews,
  getAllReviews,
  submitReview,
  approveReview,
  deleteReview,
};

