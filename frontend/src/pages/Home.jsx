import { Link } from 'react-router-dom';
import HeroVideo from '../components/HeroVideo';

const Home = () => {
  return (
    <div>
      <HeroVideo />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose RoyalRoofWorks?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">Expert Installation</h3>
              <p className="text-gray-600">
                Professional roof installation with years of experience and quality materials.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold mb-2">Quick Repairs</h3>
              <p className="text-gray-600">
                Fast and reliable roof repair services to protect your property.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">
                We stand behind our work with comprehensive warranties and excellent service.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact us today for a free quote on your roofing project.
            </p>
            <Link to="/contact" className="btn-primary text-lg px-8 py-4 inline-block">
              Get Your Free Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

