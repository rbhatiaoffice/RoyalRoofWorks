import { Link } from 'react-router-dom';

const HeroVideo = () => {
  // Using a royalty-free roofing video from Pexels/Pixabay
  const videoUrl = 'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4';

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            RoyalRoofWorks
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Quality Roofing in London
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary text-lg px-8 py-4">
              Get a Quote
            </Link>
            <Link to="/gallery" className="btn-secondary text-lg px-8 py-4 bg-white text-gray-900 hover:bg-gray-100">
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVideo;

