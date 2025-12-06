import { useState, useEffect } from 'react';
import ReviewCard from '../components/ReviewCard';
import FilePicker from '../components/FilePicker';
import { getReviews, submitReview, approveReview, deleteReview } from '../api/reviewsApi';
import { getAdminToken } from '../api/authApi';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    text: '',
  });
  const [reviewFiles, setReviewFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = !!getAdminToken();

  useEffect(() => {
    loadReviews();
  }, [page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews(page, 10);
      if (page === 1) {
        setReviews(data.reviews);
      } else {
        setReviews((prev) => [...prev, ...data.reviews]);
      }
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitReview(formData, reviewFiles);
      setFormData({ name: '', rating: 5, text: '' });
      setReviewFiles([]);
      setShowForm(false);
      alert('Review submitted successfully! It will be reviewed before publishing.');
      loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilesSelected = (files) => {
    setReviewFiles(files);
  };

  const handleApprove = async (id) => {
    const token = getAdminToken();
    if (!token) return;
    try {
      await approveReview(id, token);
      loadReviews();
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = getAdminToken();
    if (!token) return;
    try {
      await deleteReview(id, token);
      setReviews((prev) => prev.filter((review) => review._id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-4">Customer Reviews</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          See what our customers have to say about our work
        </p>

        <div className="mb-8 text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Hide Review Form' : 'Write a Review'}
          </button>
        </div>

        {showForm && (
          <div className="card max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold mb-6">Submit Your Review</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Fair</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows="5"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photos (optional)
                  </label>
                  <FilePicker
                    onFilesSelected={handleFilesSelected}
                    maxFiles={5}
                  />
                  {reviewFiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {reviewFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={file.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = [...reviewFiles];
                              URL.revokeObjectURL(newFiles[index].preview);
                              newFiles.splice(index, 1);
                              setReviewFiles(newFiles);
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <>
            <div className="space-y-6 max-w-4xl mx-auto">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onApprove={handleApprove}
                  onDelete={handleDelete}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
            {page < totalPages && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="btn-secondary"
                >
                  Load More Reviews
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reviews;

