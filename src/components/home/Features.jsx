import { FaShieldAlt, FaChartLine, FaEye, FaBolt, FaLock, FaGlobe } from 'react-icons/fa'

const Features = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Military-Grade Security",
      description: "End-to-end encryption and blockchain immutability ensure your donations are 100% secure.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaChartLine />,
      title: "Real-Time Tracking",
      description: "Follow your donation from wallet to beneficiary with live updates and verification.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaEye />,
      title: "Complete Transparency",
      description: "Every transaction is publicly verifiable on the blockchain with no hidden fees.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaBolt />,
      title: "Instant Processing",
      description: "Donations are processed in seconds with blockchain speed, not banking delays.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <FaLock />,
      title: "Zero Corruption",
      description: "Smart contracts ensure funds go directly to beneficiaries, eliminating middlemen.",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: <FaGlobe />,
      title: "Global Access",
      description: "Donate from anywhere in the world with multiple currencies and payment options.",
      gradient: "from-teal-500 to-green-500"
    }
  ]

  return (
    <section className="section-spacing-lg bg-gray-50">
      <div className="container-padded">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="badge badge-primary mb-4">Why Choose Us</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Technology Meets{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
              Compassion
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            We combine cutting-edge blockchain technology with humanitarian values 
            to create the most transparent donation platform in the world.
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card card-spacing hover:shadow-xl transition-all duration-300 h-full flex flex-col"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                  <div className="text-white text-xl">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  {feature.description}
                </p>

                {/* Decorative Line */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features