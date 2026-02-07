import Link from 'next/link'
import { FaArrowRight, FaShieldAlt, FaChartLine, FaHandsHelping } from 'react-icons/fa'

const Hero = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "100% Secure",
      description: "Blockchain verified"
    },
    {
      icon: <FaChartLine />,
      title: "Full Transparency",
      description: "Track every donation"
    },
    {
      icon: <FaHandsHelping />,
      title: "Direct Impact",
      description: "Maximum to beneficiaries"
    }
  ]

  return (
    <section className="hero-padding relative overflow-hidden bg-gradient-to-br from-primary-light/30 via-white to-blue-50/30">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/3" />
      
      <div className="container-padded relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="stack-lg">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary-dark rounded-full text-sm font-medium mb-6">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Blockchain-Powered Charity
                </div>
                
                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Donate with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                    Confidence
                  </span>
                </h1>
                
                {/* Description */}
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
                  Your Zakat and Sadaqah directly reach those in need through transparent 
                  blockchain technology. Every donation is trackable, secure, and creates real impact.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="cluster-md">
                <Link href="/donate">
                  <button className="btn btn-primary btn-spacing-lg text-lg font-medium">
                    Start Donating
                    <FaArrowRight />
                  </button>
                </Link>
                <Link href="/about">
                  <button className="btn btn-outline btn-spacing-lg text-lg font-medium">
                    Learn How It Works
                  </button>
                </Link>
              </div>

              {/* Features */}
              <div className="pt-8 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 mx-auto bg-white border border-gray-200 rounded-xl flex items-center justify-center text-primary mb-3">
                        {feature.icon}
                      </div>
                      <div className="font-medium text-gray-900 mb-1">{feature.title}</div>
                      <div className="text-sm text-gray-500">{feature.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Stats Card */}
            <div className="lg:pl-8">
              <div className="card card-spacing max-w-md mx-auto lg:mx-0 lg:ml-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Live Impact</h3>
                
                <div className="stack-md">
                  {[
                    { label: "Total Donations", value: "$2.4M+", color: "text-primary" },
                    { label: "Active NGOs", value: "50+", color: "text-secondary" },
                    { label: "Lives Impacted", value: "125K+", color: "text-accent" },
                    { label: "Success Rate", value: "98%", color: "text-success" }
                  ].map((stat, index) => (
                    <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="text-gray-600">{stat.label}</div>
                      <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Donation Card */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-2">Recent Donation</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Anonymous</div>
                      <div className="text-sm text-gray-500">To Edhi Foundation</div>
                    </div>
                    <div className="text-lg font-bold text-primary">$500</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero