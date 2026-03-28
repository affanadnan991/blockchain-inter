'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { 
  FaUserShield, 
  FaChartBar, 
  FaCog, 
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUsers,
  FaMoneyBillWave
} from 'react-icons/fa'
import NGOManagement from '@/components/admin/NGOManagement'
import FeeManagement from '@/components/admin/FeeManagement'
import EmergencyControls from '@/components/admin/EmergencyControls'
import { shortenAddress } from '@/utils/formatting'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminStats, setAdminStats] = useState({
    totalNGOs: 0,
    pendingRequests: 0,
    totalDonations: 0,
    platformFees: 0
  })
  
  const { address, isConnected } = useAccount()

  useEffect(() => {
    // Check if connected address is admin
    if (isConnected && address) {
      // Mock admin check - replace with contract check
      const adminAddresses = [
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' // Hardhat default
      ]
     setIsAdmin(
  adminAddresses.some(
    admin => admin.toLowerCase() === address?.toLowerCase()
  )
)
      
      // Load admin stats
      setAdminStats({
        totalNGOs: 6,
        pendingRequests: 3,
        totalDonations: 2450000,
        platformFees: 49000
      })
    }
  }, [isConnected, address])

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { id: 'ngos', label: 'NGO Management', icon: <FaUsers /> },
    { id: 'fees', label: 'Fee Settings', icon: <FaMoneyBillWave /> },
    { id: 'emergency', label: 'Emergency', icon: <FaExclamationTriangle /> },
    { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> }
  ]

  if (!isConnected) {
    return (
      <div className="section-spacing">
        <div className="container-padded text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access admin panel.</p>
        </div>
      </div>
    )
  }
    
  if (!isAdmin) {
    return (
      <div className="section-spacing">
        <div className="container-padded text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUserShield className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">
            Your address ({shortenAddress(address)}) does not have admin privileges.
          </p>
          <p className="text-sm text-gray-500">
            Contact platform administrator for access.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="section-spacing">
      <div className="container-padded">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                <FaUserShield className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600">
                  Admin: {shortenAddress(address)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
              <FaCheckCircle />
              <span className="font-medium">Admin Access Granted</span>
            </div>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card card-spacing-sm">
            <div className="text-2xl font-bold text-primary mb-1">{adminStats.totalNGOs}</div>
            <div className="text-sm text-gray-600">Total NGOs</div>
          </div>
          <div className="card card-spacing-sm">
            <div className="text-2xl font-bold text-orange-500 mb-1">{adminStats.pendingRequests}</div>
            <div className="text-sm text-gray-600">Pending Requests</div>
          </div>
          <div className="card card-spacing-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">
              ${(adminStats.totalDonations / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Total Donations</div>
          </div>
          <div className="card card-spacing-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              ${(adminStats.platformFees / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600">Platform Fees</div>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="mb-8">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap border-b-2
                  ${activeTab === tab.id 
                    ? 'text-primary border-primary' 
                    : 'text-gray-600 hover:text-gray-900 border-transparent'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'dashboard' && (
            <div className="card card-spacing">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h3>
              <div className="space-y-6">
                <div className="p-6 bg-blue-50 rounded-xl">
                  <h4 className="text-lg font-bold text-blue-900 mb-3">Quick Actions</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button className="btn btn-primary">Register New NGO</button>
                    <button className="btn btn-outline">View All Transactions</button>
                    <button className="btn btn-outline">Generate Reports</button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">New NGO Registered</span>
                        <span className="text-sm text-gray-500">5 min ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Withdrawal Approved</span>
                        <span className="text-sm text-gray-500">1 hour ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Fee Updated</span>
                        <span className="text-sm text-gray-500">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">System Status</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Contract Status</span>
                        <span className="text-green-600 font-medium">Active</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Emergency Mode</span>
                        <span className="text-green-600 font-medium">Inactive</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Last Backup</span>
                        <span className="text-sm text-gray-500">Today, 02:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ngos' && <NGOManagement />}
          {activeTab === 'fees' && <FeeManagement />}
          {activeTab === 'emergency' && <EmergencyControls />}
          
          {activeTab === 'security' && (
            <div className="card card-spacing">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h3>
              <p className="text-gray-600">Security settings will be implemented here.</p>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="card card-spacing">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Settings</h3>
              <p className="text-gray-600">Platform settings will be implemented here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}