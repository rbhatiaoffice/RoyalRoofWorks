import ContactForm from '../components/ContactForm';

const Contact = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Get in touch with us for a free quote or to discuss your roofing needs
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div>
            <ContactForm />
          </div>
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <address className="not-italic space-y-3">
                <div>
                  <strong className="block text-gray-700 mb-1">Address:</strong>
                  <p className="text-gray-600">
                    RoyalRoofWorks<br />
                    4th Floor, Silverstream House<br />
                    45 Fitzroy Street, Fitzrovia<br />
                    London W1T 6EB
                  </p>
                </div>
                <div>
                  <strong className="block text-gray-700 mb-1">Phone:</strong>
                  <a href="tel:07393121621" className="text-primary-600 hover:text-primary-700">
                    07393121621
                  </a>
                </div>
              </address>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Business Hours</h2>
              <div className="space-y-2 text-gray-600">
                <p><strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM</p>
                <p><strong>Saturday:</strong> 9:00 AM - 4:00 PM</p>
                <p><strong>Sunday:</strong> Closed</p>
              </div>
            </div>

            <div className="card bg-primary-600 text-white">
              <h2 className="text-2xl font-bold mb-4">Emergency Service</h2>
              <p className="mb-4">
                Need urgent roof repairs? We offer emergency roofing services 24/7.
              </p>
              <a href="tel:07393121621" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100 inline-block">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

