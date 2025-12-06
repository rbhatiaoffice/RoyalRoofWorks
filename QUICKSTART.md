# Quick Start Guide - RoyalRoofWorks

## Prerequisites Setup

1. **MongoDB Atlas** (Free tier available)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a cluster
   - Get your connection string (MONGO_URI)

2. **Cloudinary** (Free tier available)
   - Sign up at https://cloudinary.com
   - Get your Cloud Name, API Key, and API Secret

## Installation Steps

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/royalroofworks
JWT_SECRET=your_super_secret_key_here_change_this
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

Seed the database:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:5173/admin

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANT:** Change these credentials in production!

## Testing the Application

1. Visit http://localhost:5173
2. Browse the gallery (should have sample images from seed)
3. View reviews (should have sample reviews)
4. Submit a contact form
5. Login to admin dashboard at /admin
6. Upload gallery images
7. Moderate reviews

## Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Ensure all environment variables are set
- Check if port 5000 is available

### Frontend won't start
- Check if port 5173 is available
- Ensure backend is running
- Check browser console for errors

### Images not uploading
- Verify Cloudinary credentials
- Check file size (max 5MB)
- Check file format (JPEG, PNG, WebP only)

### Database connection issues
- Verify MONGO_URI format
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for development)
- Ensure database user has proper permissions

## Next Steps

1. Replace sample images with your own roofing photos
2. Update company information in Footer and Contact pages
3. Configure email notifications (optional)
4. Deploy to production (see README.md)

