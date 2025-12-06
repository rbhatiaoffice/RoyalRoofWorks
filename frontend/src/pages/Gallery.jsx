import { useState, useEffect } from 'react';
import GalleryGrid from '../components/GalleryGrid';
import UploadForm from '../components/UploadForm';
import { getGalleryImages, uploadGalleryImages, deleteGalleryImage } from '../api/galleryApi';
import { getAdminToken } from '../api/authApi';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const isAdmin = !!getAdminToken();

  useEffect(() => {
    loadImages();
  }, [page]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await getGalleryImages(page, 24);
      if (page === 1) {
        setImages(data.images);
      } else {
        setImages((prev) => [...prev, ...data.images]);
      }
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files) => {
    const token = getAdminToken();
    if (!token) {
      alert('You must be logged in as admin to upload images');
      return;
    }
    await uploadGalleryImages(files, token);
    setShowUpload(false);
    loadImages();
  };

  const handleDelete = async (id) => {
    const token = getAdminToken();
    if (!token) {
      alert('You must be logged in as admin to delete images');
      return;
    }
    try {
      await deleteGalleryImage(id, token);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-4">Our Gallery</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Browse through our completed roofing projects
        </p>

        {isAdmin && (
          <div className="mb-8">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="btn-primary mb-4"
            >
              {showUpload ? 'Hide Upload Form' : 'Upload Images'}
            </button>
            {showUpload && (
              <div className="card mb-8">
                <h2 className="text-2xl font-bold mb-4">Upload Gallery Images</h2>
                <UploadForm onUpload={handleUpload} maxFiles={10} />
              </div>
            )}
          </div>
        )}

        {loading && images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading images...</p>
          </div>
        ) : (
          <>
            <GalleryGrid
              images={images}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
            {page < totalPages && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="btn-secondary"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;

