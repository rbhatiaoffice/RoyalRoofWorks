const Services = () => {
  const services = [
    {
      title: 'Roof Installation',
      description: 'Complete roof installation services for residential and commercial properties. We use only the highest quality materials and expert craftsmanship.',
      icon: '🏗️',
    },
    {
      title: 'Roof Repair',
      description: 'Fast and reliable roof repair services to fix leaks, damaged tiles, and other roofing issues. Emergency repairs available.',
      icon: '🔨',
    },
    {
      title: 'Roof Maintenance',
      description: 'Regular maintenance to extend the life of your roof. We provide inspections, cleaning, and preventive care.',
      icon: '🛠️',
    },
    {
      title: 'Gutter Services',
      description: 'Gutter installation, repair, and cleaning services to protect your property from water damage.',
      icon: '🌧️',
    },
    {
      title: 'Flat Roofing',
      description: 'Specialized flat roofing solutions for commercial and residential properties using modern materials.',
      icon: '📐',
    },
    {
      title: 'Roof Inspections',
      description: 'Comprehensive roof inspections to assess condition and identify potential issues before they become costly problems.',
      icon: '🔍',
    },
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-4">What We Do</h1>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          RoyalRoofWorks offers comprehensive roofing services throughout London. 
          From installation to repair and maintenance, we've got you covered.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="card hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-lg mb-6">
            Every roofing project is unique. Contact us to discuss your specific needs.
          </p>
          <a href="/contact" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
            Contact Us Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;

