# RoyalRoofWorks - MERN Stack Application

A modern, scalable MERN (MongoDB, Express, React, Node.js) web application for RoyalRoofWorks, a roofing company based in London.

## Features

- 🏠 **Modern UI**: Responsive design built with React and Tailwind CSS
- 📸 **Gallery**: Image gallery with upload functionality and lightbox view
- ⭐ **Reviews**: Customer reviews with image uploads and admin moderation
- 📧 **Contact Form**: Contact form with email notifications
- 🎥 **Hero Video**: Full-width video background on homepage
- 🔐 **Admin Dashboard**: Admin panel for moderating content
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🔒 **Secure**: JWT authentication, rate limiting, input validation

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- React Dropzone

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Cloudinary (for image storage)
- JWT Authentication
- Multer (file uploads)
- Nodemailer (email notifications)

## Project Structure

```
royalroofworks/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and Cloudinary config
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Auth, upload, error handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── scripts/         # Seed scripts
│   │   └── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image storage)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd royalroofworks
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create backend `.env` file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/royalroofworks
   JWT_SECRET=your_super_secret_jwt_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   FRONTEND_URL=http://localhost:5173
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Seed the database** (optional)
   ```bash
   cd ../backend
   npm run seed
   ```
   
   Default admin credentials:
   - Username: `admin`
   - Password: `admin123`
   
   **⚠️ Change these in production!**

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173`

## API Endpoints

### Gallery
- `GET /api/gallery` - Get paginated gallery images
- `POST /api/gallery` - Upload images (Admin only)
- `DELETE /api/gallery/:id` - Delete image (Admin only)

### Reviews
- `GET /api/reviews` - Get approved reviews
- `GET /api/reviews/all` - Get all reviews (Admin only)
- `POST /api/reviews` - Submit a review
- `PUT /api/reviews/:id/approve` - Approve review (Admin only)
- `DELETE /api/reviews/:id` - Delete review (Admin only)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact messages (Admin only)

### Auth
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin (seed only)

## Admin Dashboard

Access the admin dashboard at `/admin` and login with your admin credentials.

Features:
- Moderate reviews (approve/delete)
- Upload and delete gallery images
- View contact form messages

## Deployment

### Backend Deployment (Heroku/DigitalOcean/AWS)

1. Set environment variables in your hosting platform
2. Ensure MongoDB Atlas allows connections from your server IP
3. Deploy using:
   ```bash
   npm start
   ```

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting platform
3. Update `FRONTEND_URL` in backend `.env` to your frontend URL

### Docker Deployment

See `docker-compose.yml` and `Dockerfile` files for containerized deployment.

## Environment Variables

### Backend
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `FRONTEND_URL` - Frontend URL for CORS
- `EMAIL_SMTP_HOST` - SMTP host (optional)
- `EMAIL_SMTP_PORT` - SMTP port (optional)
- `EMAIL_SMTP_USER` - SMTP username (optional)
- `EMAIL_SMTP_PASS` - SMTP password (optional)

## Security Features

- Helmet.js for security headers
- Rate limiting on API routes
- Input validation and sanitization
- JWT authentication for admin routes
- CORS configuration
- File type and size validation

## Future Enhancements

- AWS S3 integration as alternative to Cloudinary
- Direct client-side uploads to Cloudinary
- WebP image conversion
- Unit tests for backend endpoints
- E2E tests with Cypress
- Service worker for offline support
- Image compression on upload

## License

This project is proprietary software for RoyalRoofWorks.

## Contact

RoyalRoofWorks
4th Floor, Silverstream House
45 Fitzroy Street, Fitzrovia
London W1T 6EB
Phone: 07393121621
