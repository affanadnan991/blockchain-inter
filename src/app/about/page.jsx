import {
  FaShieldAlt,
  FaChartLine,
  FaLock,
  FaGlobe,
  FaQuestionCircle,
  FaUsers,
  FaHandHoldingHeart
} from 'react-icons/fa'
import Link from 'next/link'

export default function AboutPage() {
  const features = [
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Blockchain Security",
      description: "Every transaction is encrypted and recorded on the Polygon blockchain, making it immutable and transparent."
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Real-time Tracking",
      description: "Track your donation from the moment you send it until it reaches the beneficiary."
    },
    {
      icon: <FaLock className="text-3xl" />,
      title: "Zero Corruption",
      description: "Smart contracts ensure funds go directly to beneficiaries, eliminating middlemen and corruption."
    },
    {
      icon: <FaGlobe className="text-3xl" />,
      title: "Global Access",
      description: "Donate from anywhere in the world using multiple cryptocurrencies and payment methods."
    }
  ]

  const faqs = [
    {
      question: "How is ZakatChain different from traditional charities?",
      answer: "ZakatChain uses blockchain technology to provide 100% transparency. You can track every donation in real-time, see exactly where your money goes, and verify that it reaches the intended beneficiaries without any middlemen taking cuts."
    },
    {
      question: "What blockchain does ZakatChain use?",
      answer: "We use the Polygon blockchain for its low transaction fees, high speed, and environmental efficiency. This allows us to process donations quickly while keeping costs minimal."
    },
    {
      question: "How do NGOs receive donations?",
      answer: "NGOs receive donations directly into their blockchain wallets. They can then convert to local currency or use crypto directly. All withdrawals are transparent and require multiple approvals to ensure security."
    },
    {
      question: "Is my donation tax-deductible?",
      answer: "Yes! All donations through ZakatChain come with blockchain-verified receipts that are legally valid for tax purposes in most countries, including Pakistan under Section 61 of the Income Tax Ordinance."
    },
    {
      question: "What happens to the platform fees?",
      answer: "The 2% platform fee covers blockchain transaction costs, platform maintenance, security audits, and development. We maintain complete transparency about all fees and costs."
    },
    {
      question: "How are NGOs verified?",
      answer: "Every NGO undergoes strict verification including legal registration checks, financial audits, site visits, and community impact assessment. Only verified NGOs are listed on our platform."
    }
  ]

  const steps = [
    {
      number: "1",
      title: "Connect Wallet",
      description: "Connect your MetaMask wallet securely"
    },
    {
      number: "2",
      title: "Choose Cause",
      description: "Select from verified NGOs or general donation pool"
    },
    {
      number: "3",
      title: "Donate Securely",
      description: "Donate using MATIC, USDT, USDC or DAI"
    },
    {
      number: "4",
      title: "Track Impact",
      description: "Follow your donation's journey in real-time"
    },
    {
      number: "5",
      title: "Get Receipt",
      description: "Download blockchain-verified tax receipt"
    }
  ]

  return (
    <div className="section-spacing">
      <div className="container-padded">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
              Works
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Transparency meets technology. Discover how we're revolutionizing charitable giving.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="card card-spacing text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <div className="text-primary">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div className="card card-spacing-lg mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple 5-Step Process</h2>
            <p className="text-gray-600">Donating has never been easier or more transparent</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-1/2" />

            <div className="grid lg:grid-cols-5 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 mx-auto bg-white border-2 border-primary/20 rounded-full flex items-center justify-center group-hover:border-primary/40">
                      <div className="text-2xl font-bold text-primary">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/donate">
              <button className="btn btn-primary px-8 py-4 text-lg">
                <FaHandHoldingHeart className="mr-2 ml-17" />
                Start Donating Now
              </button>
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <FaQuestionCircle className="text-primary" />
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <p className="text-gray-600">Get answers to common questions about our platform</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card card-spacing">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUsers className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-white/90 mb-8">
              Join thousands of donors who are using technology to create transparent impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate">
                <button className="btn bg-white text-primary hover:bg-white/90 px-8 py-4">
                  Donate Now
                </button>
              </Link>
              <Link href="/ngos">
                <button className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-4">
                  Browse NGOs
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}