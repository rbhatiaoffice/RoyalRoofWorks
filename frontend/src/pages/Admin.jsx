import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  loginAdmin,
  getAdminToken,
  getAdminUser,
  logoutAdmin,
} from '../api/authApi';
import { getAllReviews, approveReview, deleteReview } from '../api/reviewsApi';
import { getGalleryImages, deleteGalleryImage, uploadGalleryImages } from '../api/galleryApi';
import { getContactMessages } from '../api/contactApi';
import UploadForm from '../components/UploadForm';
import ReviewCard from '../components/ReviewCard';
import GalleryGrid from '../components/GalleryGrid';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAdminToken());
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = getAdminToken();
      if (activeTab === 'reviews') {
        const data = await getAllReviews(1, 50, token);
        setReviews(data.reviews);
      } else if (activeTab === 'gallery') {
        const data = await getGalleryImages(1, 50);
        setGalleryImages(data.images);
      } else if (activeTab === 'messages') {
        const data = await getContactMessages(1, 50, token);
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(loginData);
      setIsAuthenticated(true);
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleApproveReview = async (id) => {
    const token = getAdminToken();
    await approveReview(id, token);
    loadData();
  };

  const handleDeleteReview = async (id) => {
    const token = getAdminToken();
    await deleteReview(id, token);
    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  const handleDeleteImage = async (id) => {
    const token = getAdminToken();
    await deleteGalleryImage(id, token);
    setGalleryImages((prev) => prev.filter((img) => img._id !== id));
  };

  const handleUploadImages = async (files) => {
    const token = getAdminToken();
    await uploadGalleryImages(files, token);
    loadData();
  };

  if (!isAuthenticated) {
    return (
      <div className="py-16">
        <div className="max-w-md mx-auto card">
          <h2 className="text-3xl font-bold mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-4 border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-2 px-4 border-b-2 ${
                activeTab === 'gallery'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-2 px-4 border-b-2 ${
                activeTab === 'messages'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              Messages
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    onApprove={handleApproveReview}
                    onDelete={handleDeleteReview}
                    isAdmin={true}
                  />
                ))}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div>
                <div className="card mb-8">
                  <h2 className="text-2xl font-bold mb-4">Upload Images</h2>
                  <UploadForm onUpload={handleUploadImages} maxFiles={10} />
                </div>
                <GalleryGrid
                  images={galleryImages}
                  onDelete={handleDeleteImage}
                  isAdmin={true}
                />
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message._id} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{message.name}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      <strong>Email:</strong> {message.email}
                    </p>
                    {message.phone && (
                      <p className="text-gray-600 mb-2">
                        <strong>Phone:</strong> {message.phone}
                      </p>
                    )}
                    <p className="text-gray-700">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;

