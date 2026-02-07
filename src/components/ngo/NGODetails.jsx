import { FaUsers, FaAmbulance, FaHome, FaHospital, FaPaw, FaRecycle } from 'react-icons/fa'

const NGODetails = ({ ngo }) => {
  const services = ngo.services || []
  const stats = ngo.stats || {}

  const serviceIcons = {
    'Ambulance Services': <FaAmbulance className="text-red-500" />,
    'Orphanages': <FaHome className="text-blue-500" />,
    'Healthcare Clinics': <FaHospital className="text-green-500" />,
    'Homeless Shelters': <FaHome className="text-purple-500" />,
    'Animal Shelters': <FaPaw className="text-orange-500" />,
    'Rehabilitation Centers': <FaRecycle className="text-teal-500" />
  }

  return (
    <div className="space-y-8">
      {/* Services */}
      <div className="card card-spacing">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Services Provided</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center mr-4">
                {serviceIcons[service] || <FaUsers className="text-gray-400" />}
              </div>
              <span className="font-medium text-gray-900">{service}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="card card-spacing">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Organization Stats</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{value.toLocaleString()}</div>
              <div className="text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Donations */}
      {ngo.recentDonations && ngo.recentDonations.length > 0 && (
        <div className="card card-spacing">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Donations</h3>
          <div className="space-y-4">
            {ngo.recentDonations.map((donation, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900">{donation.donor}</div>
                  <div className="text-sm text-gray-600">{donation.date}</div>
                </div>
                <div className="text-xl font-bold text-primary">
                  ${donation.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NGODetails