import { FaWallet, FaSearch, FaHandHoldingUsd, FaChartBar, FaReceipt } from 'react-icons/fa'

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: <FaWallet className="text-2xl" />,
      title: "Connect Wallet",
      description: "Securely connect your MetaMask wallet with one click"
    },
    {
      number: "02",
      icon: <FaSearch className="text-2xl" />,
      title: "Choose Cause",
      description: "Browse verified NGOs and select your preferred cause"
    },
    {
      number: "03",
      icon: <FaHandHoldingUsd className="text-2xl" />,
      title: "Donate Securely",
      description: "Donate in MATIC, USDT, USDC or DAI with full transparency"
    },
    {
      number: "04",
      icon: <FaChartBar className="text-2xl" />,
      title: "Track Impact",
      description: "Monitor your donation's journey in real-time on blockchain"
    },
    {
      number: "05",
      icon: <FaReceipt className="text-2xl" />,
      title: "Get Receipt",
      description: "Download blockchain-verified tax receipt instantly"
    }
  ]

  return (
    <section className="section-py bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="badge badge-primary mb-4">Simple Process</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Donate in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
              5 Minutes
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Our streamlined process makes donating as easy as possible while 
            maintaining maximum transparency and security.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-1/2" />
          
          <div className="grid lg:grid-cols-5 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                {/* Step Number */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform" />
                  <div className="relative w-20 h-20 mx-auto bg-white border-2 border-primary/20 rounded-full flex items-center justify-center group-hover:border-primary/40 transition-colors">
                    <div className="text-2xl font-bold text-primary">
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-md">
                    <div className="text-primary">
                      {step.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks