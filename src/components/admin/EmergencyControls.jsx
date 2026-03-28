'use client'

import { useState } from 'react'
import {
  FaExclamationTriangle,
  FaShieldAlt,
  FaLock,
  FaUnlock,
  FaBan,
  FaCheckCircle,
  FaTimesCircle,
  FaHistory
} from 'react-icons/fa'
import Button from '../ui/Button'
import useIsOwner from '../../hooks/useIsOwner'

const EmergencyControls = () => {
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [pauseWithdrawals, setPauseWithdrawals] = useState(false)
  const [pauseDonations, setPauseDonations] = useState(false)
  const [selectedNGO, setSelectedNGO] = useState('')
  const [confirmationText, setConfirmationText] = useState('')
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [actionType, setActionType] = useState('')

  const ngoOptions = [
    { id: 'all', name: 'All NGOs' },
    { id: 'edhi', name: 'Edhi Foundation' },
    { id: 'skmh', name: 'Shaukat Khanum' },
    { id: 'tcf', name: 'TCF' }
  ]

  const emergencyActions = [
    {
      id: 'emergency_mode',
      title: 'Emergency Mode',
      description: 'Pause all platform operations',
      icon: <FaExclamationTriangle className="text-red-500" />,
      status: emergencyMode,
      action: () => {
        setActionType('emergency')
        setShowEmergencyModal(true)
      }
    },
    {
      id: 'pause_withdrawals',
      title: 'Pause Withdrawals',
      description: 'Stop all NGO withdrawals',
      icon: <FaLock className="text-orange-500" />,
      status: pauseWithdrawals,
      action: () => {
        setActionType('withdrawals')
        setShowWithdrawalModal(true)
      }
    },
    {
      id: 'pause_donations',
      title: 'Pause Donations',
      description: 'Stop all incoming donations',
      icon: <FaBan className="text-purple-500" />,
      status: pauseDonations,
      action: () => {
        setActionType('donations')
        setShowDonationModal(true)
      }
    }
  ]

  const handleEmergencyToggle = () => {
    if (!emergencyMode) {
      // Activate emergency mode
      setEmergencyMode(true)
      setPauseWithdrawals(true)
      setPauseDonations(true)
      alert('🚨 EMERGENCY MODE ACTIVATED\nAll platform operations are paused.')
    } else {
      // Deactivate emergency mode
      setEmergencyMode(false)
      alert('Emergency mode deactivated. Platform operations resumed.')
    }
    setShowEmergencyModal(false)
  }

  const handleWithdrawalToggle = () => {
    setPauseWithdrawals(!pauseWithdrawals)
    alert(`Withdrawals ${!pauseWithdrawals ? 'paused' : 'resumed'} for ${selectedNGO === 'all' ? 'all NGOs' : 'selected NGO'}`)
    setShowWithdrawalModal(false)
  }

  const handleDonationToggle = () => {
    setPauseDonations(!pauseDonations)
    alert(`Donations ${!pauseDonations ? 'paused' : 'resumed'}`)
    setShowDonationModal(false)
  }

  const emergencyLogs = [
    { id: 1, action: 'Emergency Mode Activated', by: 'Admin', timestamp: '2024-02-20 14:30:00' },
    { id: 2, action: 'Withdrawals Paused - All NGOs', by: 'Admin', timestamp: '2024-02-15 10:15:00' },
    { id: 3, action: 'Donations Resumed', by: 'Admin', timestamp: '2024-02-10 09:00:00' },
    { id: 4, action: 'Emergency Mode Deactivated', by: 'Admin', timestamp: '2024-02-05 16:45:00' }
  ]

  return (
    (() => {
      const { isOwner, isLoading: ownerLoading } = useIsOwner()
      if (ownerLoading) return <div className="h-40 flex items-center justify-center">Loading...</div>
      if (!isOwner) return (
        <div className="min-h-[240px] flex items-center justify-center">
          <div className="text-center max-w-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h2>
            <p className="text-gray-500">Only the contract owner may access emergency controls.</p>
          </div>
        </div>
      )
    })(),
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <FaExclamationTriangle className="text-red-500 text-2xl flex-shrink-0" />
          <div>
            <h4 className="text-lg font-bold text-red-900 mb-2">⚠️ Emergency Controls</h4>
            <p className="text-red-700">
              Use these controls only in emergency situations. These actions affect the entire platform
              and should be used with extreme caution. All emergency actions are logged and require confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="card card-spacing">
        <h4 className="text-xl font-bold text-gray-900 mb-6">Current Platform Status</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl ${emergencyMode ? 'bg-red-100' : 'bg-green-100'}`}>
            <div className="flex items-center gap-3 mb-2">
              {emergencyMode ? <FaTimesCircle className="text-red-500" /> : <FaCheckCircle className="text-green-500" />}
              <span className="font-bold">Emergency Mode</span>
            </div>
            <div className={emergencyMode ? 'text-red-700' : 'text-green-700'}>
              {emergencyMode ? 'ACTIVE - All operations paused' : 'INACTIVE - Normal operations'}
            </div>
          </div>

          <div className={`p-4 rounded-xl ${pauseWithdrawals ? 'bg-orange-100' : 'bg-green-100'}`}>
            <div className="flex items-center gap-3 mb-2">
              {pauseWithdrawals ? <FaLock className="text-orange-500" /> : <FaUnlock className="text-green-500" />}
              <span className="font-bold">Withdrawals</span>
            </div>
            <div className={pauseWithdrawals ? 'text-orange-700' : 'text-green-700'}>
              {pauseWithdrawals ? 'PAUSED' : 'ACTIVE'}
            </div>
          </div>

          <div className={`p-4 rounded-xl ${pauseDonations ? 'bg-purple-100' : 'bg-green-100'}`}>
            <div className="flex items-center gap-3 mb-2">
              {pauseDonations ? <FaBan className="text-purple-500" /> : <FaCheckCircle className="text-green-500" />}
              <span className="font-bold">Donations</span>
            </div>
            <div className={pauseDonations ? 'text-purple-700' : 'text-green-700'}>
              {pauseDonations ? 'PAUSED' : 'ACTIVE'}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Actions */}
      <div className="card card-spacing">
        <h4 className="text-xl font-bold text-gray-900 mb-6">Emergency Actions</h4>

        <div className="grid md:grid-cols-3 gap-6">
          {emergencyActions.map((action) => (
            <div key={action.id} className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                {action.icon}
                <h5 className="text-lg font-bold text-gray-900">{action.title}</h5>
              </div>

              <p className="text-gray-600 mb-6">{action.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`font-medium ${action.status ? 'text-red-600' : 'text-green-600'}`}>
                  {action.status ? 'Active' : 'Inactive'}
                </span>
              </div>

              <Button
                onClick={action.action}
                variant={action.status ? "outline" : "danger"}
                className="w-full"
              >
                {action.status ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Withdrawal */}
      <div className="card card-spacing">
        <div className="flex items-center gap-3 mb-6">
          <FaShieldAlt className="text-primary text-2xl" />
          <h4 className="text-xl font-bold text-gray-900">Emergency Fund Withdrawal</h4>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 rounded-xl">
            <p className="text-yellow-700">
              This feature allows direct withdrawal of stuck funds in emergency situations.
              Requires multi-signature approval and is logged for transparency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Token
              </label>
              <select className="input w-full">
                <option value="">Select token</option>
                <option value="matic">MATIC</option>
                <option value="usdt">USDT</option>
                <option value="usdc">USDC</option>
                <option value="dai">DAI</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input type="text" placeholder="0.00" className="input w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Address
              </label>
              <input type="text" placeholder="0x..." className="input w-full font-mono" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <input type="text" placeholder="Emergency reason..." className="input w-full" />
            </div>
          </div>

          <Button variant="danger" className="w-full">
            Initiate Emergency Withdrawal
          </Button>
        </div>
      </div>

      {/* Emergency Logs */}
      <div className="card card-spacing">
        <div className="flex items-center gap-3 mb-6">
          <FaHistory className="text-primary text-2xl" />
          <h4 className="text-xl font-bold text-gray-900">Emergency Action Logs</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">By</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {emergencyLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{log.action}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{log.by}</td>
                  <td className="py-3 px-4 text-gray-600">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Mode Modal */}
      {showEmergencyModal && (
        <EmergencyModal
          title="Activate Emergency Mode"
          message="This will pause ALL platform operations including donations and withdrawals. Continue?"
          onConfirm={handleEmergencyToggle}
          onCancel={() => setShowEmergencyModal(false)}
          confirmationText={confirmationText}
          setConfirmationText={setConfirmationText}
          confirmText="ACTIVATE EMERGENCY MODE"
          type="danger"
        />
      )}

      {/* Pause Withdrawals Modal */}
      {showWithdrawalModal && (
        <EmergencyModal
          title={pauseWithdrawals ? "Resume Withdrawals" : "Pause Withdrawals"}
          message={`This will ${pauseWithdrawals ? 'resume' : 'pause'} withdrawals for ${selectedNGO === 'all' ? 'all NGOs' : 'selected NGO'}. Continue?`}
          onConfirm={handleWithdrawalToggle}
          onCancel={() => setShowWithdrawalModal(false)}
          confirmationText={confirmationText}
          setConfirmationText={setConfirmationText}
          confirmText={pauseWithdrawals ? "RESUME WITHDRAWALS" : "PAUSE WITHDRAWALS"}
          type="warning"
          showNGOSelect={true}
          ngoOptions={ngoOptions}
          selectedNGO={selectedNGO}
          setSelectedNGO={setSelectedNGO}
        />
      )}

      {/* Pause Donations Modal */}
      {showDonationModal && (
        <EmergencyModal
          title={pauseDonations ? "Resume Donations" : "Pause Donations"}
          message={`This will ${pauseDonations ? 'resume' : 'pause'} all incoming donations. Continue?`}
          onConfirm={handleDonationToggle}
          onCancel={() => setShowDonationModal(false)}
          confirmationText={confirmationText}
          setConfirmationText={setConfirmationText}
          confirmText={pauseDonations ? "RESUME DONATIONS" : "PAUSE DONATIONS"}
          type="warning"
        />
      )}
    </div>
  )
}

// Emergency Modal Component
const EmergencyModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmationText,
  setConfirmationText,
  confirmText,
  type = 'warning',
  showNGOSelect = false,
  ngoOptions = [],
  selectedNGO,
  setSelectedNGO
}) => {
  const getTypeColors = () => {
    switch (type) {
      case 'danger': return 'bg-red-100 text-red-900 border-red-200'
      case 'warning': return 'bg-orange-100 text-orange-900 border-orange-200'
      default: return 'bg-blue-100 text-blue-900 border-blue-200'
    }
  }

  const getButtonVariant = () => {
    switch (type) {
      case 'danger': return 'danger'
      case 'warning': return 'secondary'
      default: return 'primary'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className={`flex items-center gap-3 p-4 rounded-xl ${getTypeColors()} mb-6`}>
            <FaExclamationTriangle className="text-2xl" />
            <h4 className="text-xl font-bold">{title}</h4>
          </div>

          {/* Message */}
          <p className="text-gray-700 mb-6">{message}</p>

          {/* NGO Selection */}
          {showNGOSelect && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select NGO
              </label>
              <select
                value={selectedNGO}
                onChange={(e) => setSelectedNGO(e.target.value)}
                className="input w-full"
              >
                <option value="">Select NGO</option>
                {ngoOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Confirmation Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type "CONFIRM" to proceed
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="CONFIRM"
              className="input w-full uppercase"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={confirmationText !== 'CONFIRM'}
              className={`btn flex-1 ${getButtonVariant() === 'danger' ? 'btn-danger' :
                getButtonVariant() === 'secondary' ? 'btn-secondary' : 'btn-primary'
                }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmergencyControls