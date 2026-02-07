import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaGithub,
  FaHeart,
  FaShieldAlt,
  FaGlobe
} from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const links = {
    Platform: [
      { label: 'Donate', href: '/donate' },
      { label: 'NGOs', href: '/ngos' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'How It Works', href: '/about' }
    ],
    Resources: [
      { label: 'Documentation', href: '#' },
      { label: 'API', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Help Center', href: '#' }
    ],
    Legal: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Tax Information', href: '#' }
    ],
    Company: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Contact', href: '#' }
    ]
  }

  const socialLinks = [
    { icon: <FaFacebook />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
    { icon: <FaGithub />, href: '#', label: 'GitHub' }
  ]

  const audits = [
    { name: 'CertiK', color: 'bg-blue-100 text-blue-700' },
    { name: 'OpenZeppelin', color: 'bg-green-100 text-green-700' },
    { name: 'Quantstamp', color: 'bg-purple-100 text-purple-700' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                <FaHeart className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">ZakatChain</div>
                <div className="text-gray-400">Transparent Blockchain Donations</div>
              </div>
            </div>
            
            <p className="text-gray-400 mb-8 max-w-md">
              Revolutionizing charitable giving through blockchain technology. 
              Every donation is transparent, secure, and creates real impact.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mb-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            {/* Audits */}
            <div>
              <div className="text-gray-400 text-sm mb-3">Audited By</div>
              <div className="flex flex-wrap gap-2">
                {audits.map((audit, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${audit.color}`}
                  >
                    {audit.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-lg font-semibold mb-6">{category}</h4>
                <ul className="space-y-3">
                  {items.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-gray-400 text-sm">
            © {currentYear} ZakatChain. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FaShieldAlt />
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FaGlobe />
              <span>Global Coverage</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            Contract: 0x9fE467...a6e0
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="bg-gray-950 py-4">
        <div className="container-custom text-center text-gray-500 text-sm">
          Made with ❤️ for the Muslim Ummah • Powered by Polygon Blockchain
        </div>
      </div>
    </footer>
  )
}

export default Footer