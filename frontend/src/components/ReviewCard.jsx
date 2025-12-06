import { useState } from 'react';

const ReviewCard = ({ review, onApprove, onDelete, isAdmin = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">{review.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {renderStars(review.rating)}
            <span className="text-gray-600 text-sm">({review.rating}/5)</span>
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            {!review.approved && (
              <button
                onClick={() => onApprove(review._id)}
                className="text-green-600 hover:text-green-700 text-sm font-semibold"
              >
                Approve
              </button>
            )}
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this review?')) {
                  onDelete(review._id);
                }
              }}
              className="text-red-600 hover:text-red-700 text-sm font-semibold"
            >
              Delete
            </button>
          </div>
        )}
        {review.approved && (
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
            Verified
          </span>
        )}
      </div>
      <p className="text-gray-700 mb-4">{review.text}</p>
      {review.images && review.images.length > 0 && (
        <div className="relative">
          <img
            src={review.images[currentImageIndex]?.url || review.images[currentImageIndex]?.thumbnailUrl}
            alt={`Review by ${review.name}`}
            className="w-full h-64 object-cover rounded-lg"
          />
          {review.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (prev) => (prev - 1 + review.images.length) % review.images.length
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-70"
              >
                ‹
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) => (prev + 1) % review.images.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-70"
              >
                ›
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {review.images.length}
              </div>
            </>
          )}
        </div>
      )}
      <p className="text-gray-500 text-sm mt-4">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ReviewCard;

