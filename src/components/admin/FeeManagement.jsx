'use client'

import { useState, useEffect } from 'react'
import { FaPercentage, FaHistory, FaSync, FaChartLine, FaInfoCircle } from 'react-icons/fa'
import Button from '../ui/Button'
import useIsOwner from '../../hooks/useIsOwner'

const FeeManagement = () => {
  const [platformFee, setPlatformFee] = useState(2)
  const [newFee, setNewFee] = useState(2)
  const [feeHistory, setFeeHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    fetchFeeData()
  }, [])

  const fetchFeeData = async () => {
    setLoading(true)
    // Mock data
    setTimeout(() => {
      setPlatformFee(2)
      setNewFee(2)
      setFeeHistory([
        { id: 1, oldFee: 3, newFee: 2, changedBy: "Admin 1", timestamp: "2024-02-15 14:30", reason: "Reduced to attract more donors" },
        { id: 2, oldFee: 5, newFee: 3, changedBy: "Admin 2", timestamp: "2024-01-10 10:15", reason: "Platform optimization" },
        { id: 3, oldFee: 5, newFee: 5, changedBy: "Admin 1", timestamp: "2023-12-01 09:00", reason: "Initial fee set" }
      ])
      setLoading(false)
    }, 1000)
  }

  const handleUpdateFee = () => {
    if (newFee < 0 || newFee > 5) {
      alert('Fee must be between 0% and 5%')
      return
    }

    setShowConfirmation(true)
  }

  const confirmUpdateFee = () => {
    // Add to history
    const newHistory = [
      {
        id: feeHistory.length + 1,
        oldFee: platformFee,
        newFee: newFee,
        changedBy: "Current Admin",
        timestamp: new Date().toLocaleString(),
        reason: "Manual update"
      },
      ...feeHistory
    ]

    setPlatformFee(newFee)
    setFeeHistory(newHistory)
    setShowConfirmation(false)
    
    alert(`Platform fee updated to ${newFee}%`)
  }

  const calculateImpact = (oldFee, newFee) => {
    const monthlyDonations = 1000000 // $1M monthly average
    const oldMonthlyFees = (monthlyDonations * oldFee) / 100
    const newMonthlyFees = (monthlyDonations * newFee) / 100
    const difference = newMonthlyFees - oldMonthlyFees
    
    return {
      oldMonthly: oldMonthlyFees,
      newMonthly: newMonthlyFees,
      difference: Math.abs(difference),
      isIncrease: difference > 0
    }
  }

  const impact = calculateImpact(platformFee, newFee)

  const { isOwner, isLoading: ownerLoading } = useIsOwner()

  if (ownerLoading) return <div className="h-40 flex items-center justify-center">Loading...</div>
  if (!isOwner) return (
    <div className="min-h-[240px] flex items-center justify-center">
      <div className="text-center max-w-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h2>
        <p className="text-gray-500">Only the contract owner may manage fees.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Fee Management</h3>
        <p className="text-gray-600">Manage platform fees and view fee history</p>
      </div>

      {/* Current Fee Card */}
      <div className="card card-spacing">
        <div className="flex items-center gap-3 mb-6">
          <FaPercentage className="text-primary text-2xl" />
          <h4 className="text-xl font-bold text-gray-900">Current Platform Fee</h4>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Fee Display */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">{platformFee}%</div>
              <div className="text-gray-600">Current platform fee</div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-500 mt-1" />
                <div>
                  <p className="text-blue-900 font-medium mb-1">Fee Information</p>
                  <p className="text-blue-700 text-sm">
                    This fee is deducted from each donation and used for platform maintenance, 
                    security, and development.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fee Update Form */}
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Update Platform Fee (0-5%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={newFee}
                  onChange={(e) => setNewFee(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <div className="w-20">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={newFee}
                    onChange={(e) => setNewFee(parseFloat(e.target.value) || 0)}
                    className="input text-center"
                  />
                  <div className="text-xs text-gray-500 text-center mt-1">%</div>
                </div>
              </div>
            </div>

            {/* Impact Analysis */}
            {platformFee !== newFee && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <FaChartLine className="text-primary" />
                  <h5 className="font-medium text-gray-900">Impact Analysis</h5>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current monthly fees:</span>
                    <span className="font-medium">${impact.oldMonthly.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New monthly fees:</span>
                    <span className={`font-medium ${impact.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                      ${impact.newMonthly.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Monthly change:</span>
                    <span className={`font-bold ${impact.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                      {impact.isIncrease ? '+' : '-'}${impact.difference.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleUpdateFee}
              disabled={platformFee === newFee}
              className="w-full"
            >
              <FaSync className="mr-2" />
              Update Fee
            </Button>
          </div>
        </div>
      </div>

      {/* Fee History */}
      <div className="card card-spacing">
        <div className="flex items-center gap-3 mb-6">
          <FaHistory className="text-primary text-2xl" />
          <h4 className="text-xl font-bold text-gray-900">Fee Change History</h4>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading fee history...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Change</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Changed By</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Timestamp</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Reason</th>
                </tr>
              </thead>
              <tbody>
                {feeHistory.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-red-500 font-medium">{record.oldFee}%</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-green-500 font-medium">{record.newFee}%</span>
                        <div className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                          record.newFee > record.oldFee 
                            ? 'bg-red-100 text-red-700' 
                            : record.newFee < record.oldFee 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {record.newFee > record.oldFee ? 'Increase' : 
                           record.newFee < record.oldFee ? 'Decrease' : 'No Change'}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{record.changedBy}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{record.timestamp}</td>
                    <td className="py-3 px-4 text-gray-600">{record.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && feeHistory.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No fee change history available
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Confirm Fee Update</h4>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Current Fee:</span>
                  <span className="text-2xl font-bold text-gray-900">{platformFee}%</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">New Fee:</span>
                  <span className="text-2xl font-bold text-primary">{newFee}%</span>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-blue-900 text-sm">
                    This change will affect all future donations. Historical donations will not be affected.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpdateFee}
                  className="btn btn-primary flex-1"
                >
                  Confirm Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeeManagement