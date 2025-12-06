require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const GalleryImage = require('../models/GalleryImage');
const Review = require('../models/Review');

// Sample gallery images (using placeholder URLs)
const sampleGalleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    publicId: 'sample-roofing-1',
    alt: 'Modern roofing installation',
    uploadedBy: 'admin',
  },
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
    publicId: 'sample-roofing-2',
    alt: 'Roof repair work',
    uploadedBy: 'admin',
  },
  {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    publicId: 'sample-roofing-3',
    alt: 'Commercial roofing project',
    uploadedBy: 'admin',
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    publicId: 'sample-roofing-4',
    alt: 'Residential roofing',
    uploadedBy: 'admin',
  },
];

// Sample reviews
const sampleReviews = [
  {
    name: 'John Smith',
    rating: 5,
    text: 'Excellent work! RoyalRoofWorks did an amazing job on our roof replacement. Professional, timely, and great quality.',
    images: [],
    approved: true,
  },
  {
    name: 'Sarah Johnson',
    rating: 5,
    text: 'Highly recommend! The team was professional and the work was completed on time. Our new roof looks fantastic.',
    images: [],
    approved: true,
  },
  {
    name: 'Michael Brown',
    rating: 4,
    text: 'Good service overall. Minor delays but the quality of work was excellent. Would use again.',
    images: [],
    approved: true,
  },
  {
    name: 'Emma Davis',
    rating: 5,
    text: 'Outstanding roofing company! They fixed our leak quickly and efficiently. Very satisfied with the service.',
    images: [],
    approved: true,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Admin.deleteMany();
    // await GalleryImage.deleteMany();
    // await Review.deleteMany();

    // Create admin user
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      const admin = await Admin.create({
        username: 'admin',
        password: 'admin123', // Change this in production!
      });
      console.log('Admin user created:', admin.username);
    } else {
      console.log('Admin user already exists');
    }

    // Seed gallery images
    const galleryCount = await GalleryImage.countDocuments();
    if (galleryCount === 0) {
      await GalleryImage.insertMany(sampleGalleryImages);
      console.log('Sample gallery images seeded');
    } else {
      console.log('Gallery images already exist');
    }

    // Seed reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      await Review.insertMany(sampleReviews);
      console.log('Sample reviews seeded');
    } else {
      console.log('Reviews already exist');
    }

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

