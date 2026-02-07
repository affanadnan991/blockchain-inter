import { FaChartLine, FaMoneyBillWave, FaReceipt, FaShieldAlt } from 'react-icons/fa'

const NGOStats = ({ ngo }) => {
  const transparencyData = [
    { label: "Fund Allocation", value: "98%", description: "to programs and services" },
    { label: "Administrative Costs", value: "2%", description: "lowest in industry" },
    { label: "Audit Frequency", value: "Quarterly", description: "third-party verified" },
    { label: "Real-time Tracking", value: "100%", description: "blockchain verified" }
  ]

  const financials = [
    { year: "2023", revenue: "$1.2M", expenses: "$1.1M", efficiency: "92%" },
    { year: "2022", revenue: "$980K", expenses: "$920K", efficiency: "94%" },
    { year: "2021", revenue: "$850K", expenses: "$810K", efficiency: "95%" }
  ]

  return (
    <div className="space-y-8">
      {/* Transparency Score */}
      <div className="card card-spacing">
        <div className="flex items-center gap-3 mb-6">
          <FaShieldAlt className="text-primary text-2xl" />
          <h3 className="text-2xl font-bold text-gray-900">Transparency Score: 100/100</h3>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {transparencyData.map((item, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-primary mb-2">{item.value}</div>
              <div className="font-medium text-gray-900 mb-1">{item.label}</div>
              <div className="text-sm text-gray-600">{item.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Overview */}
      <div className="card card-spacing">
        <div className="flex items-center gap-3 mb-6">
          <FaMoneyBillWave className="text-primary text-2xl" />
          <h3 className="text-2xl font-bold text-gray-900">Financial Overview</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Year</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Revenue</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Expenses</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Efficiency</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Reports</th>
              </tr>
            </thead>
            <tbody>
              {financials.map((financial, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-4 font-medium">{financial.year}</td>
                  <td className="py-3 px-4 font-medium text-green-600">{financial.revenue}</td>
                  <td className="py-3 px-4">{financial.expenses}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {financial.efficiency}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-primary hover:text-primary-dark text-sm font-medium">
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="card card-spacing">
        <div className="flex items-center gap-3 mb-6">
          <FaChartLine className="text-primary text-2xl" />
          <h3 className="text-2xl font-bold text-gray-900">Blockchain Verification</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-blue-900">All Transactions Verified</div>
                <div className="text-sm text-blue-700">
                  Every donation is recorded on the Polygon blockchain
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">✓</div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-green-900">Smart Contract Audited</div>
                <div className="text-sm text-green-700">
                  Security verified by third-party auditors
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">✓</div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-purple-900">Real-time Tracking</div>
                <div className="text-sm text-purple-700">
                  Monitor fund allocation in real-time
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NGOStats