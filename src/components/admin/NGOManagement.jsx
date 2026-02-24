'use client'

import { useState } from 'react'
import { FaPlus, FaCheck, FaTimes, FaLink, FaFingerprint } from 'react-icons/fa'
import { useAdmin } from '../../hooks/useAdmin'
import { useNGOData } from '../../hooks/useNGOData'
import Button from '../../components/ui/Button'
import useIsOwner from '../../hooks/useIsOwner'

export default function NGOManagement() {
  const { registerNGO, updateNGOStatus, isLoading } = useAdmin()
  const { ngos, refresh } = useNGOData()
  const { isOwner, isLoading: ownerLoading } = useIsOwner()

  if (ownerLoading) return <div className="h-40 flex items-center justify-center">Loading...</div>
  if (!isOwner) return (
    <div className="min-h-[240px] flex items-center justify-center">
      <div className="text-center max-w-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h2>
        <p className="text-gray-500">Only the contract owner may manage NGOs.</p>
      </div>
    </div>
  )

  const [isRegistering, setIsRegistering] = useState(false)
  const [newNGO, setNewNGO] = useState({
    address: '',
    name: '',
    approvers: '',
    minApprovals: 1
  })

  const handleRegister = async (e) => {
    e.preventDefault()
    const approverList = newNGO.approvers.split(',').map(a => a.trim()).filter(a => a)
    try {
      await registerNGO(newNGO.address, newNGO.name, approverList, newNGO.minApprovals)
      setIsRegistering(false)
      setNewNGO({ address: '', name: '', approvers: '', minApprovals: 1 })
      refresh()
    } catch (err) {
      console.error(err)
    }
  }

  const toggleStatus = async (address, currentStatus) => {
    try {
      await updateNGOStatus(address, !currentStatus)
      refresh()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">NGO Management</h2>
          <p className="text-gray-500">Registry of verified organizations on the platform.</p>
        </div>
        <Button
          onClick={() => setIsRegistering(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <FaPlus className="mr-2" /> Register NGO
        </Button>
      </div>

      {isRegistering && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">NGO Wallet Address</label>
                <input
                  required
                  value={newNGO.address}
                  onChange={e => setNewNGO({ ...newNGO, address: e.target.value })}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">NGO Name</label>
                <input
                  required
                  value={newNGO.name}
                  onChange={e => setNewNGO({ ...newNGO, name: e.target.value })}
                  placeholder="Impact Foundation"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Approver Addresses (Comma separated)</label>
              <textarea
                required
                value={newNGO.approvers}
                onChange={e => setNewNGO({ ...newNGO, approvers: e.target.value })}
                placeholder="0x123..., 0x456..."
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Min Required Approvals</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newNGO.minApprovals}
                  onChange={e => setNewNGO({ ...newNGO, minApprovals: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm Registration
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRegistering(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">NGO Detail</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Approvals</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ngos.map((ngo) => (
                <tr key={ngo.address} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <FaFingerprint />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{ngo.name}</div>
                        <div className="text-sm font-mono text-gray-500">{ngo.address.slice(0, 10)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm font-bold text-gray-900">{ngo.minApprovals} required</div>
                    <div className="text-xs text-gray-500">Multisig verification active</div>
                  </td>
                  <td className="px-6 py-6">
                    {ngo.isActive ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">ACTIVE</span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">INACTIVE</span>
                    )}
                  </td>
                  <td className="px-6 py-6 text-right">
                    <Button
                      onClick={() => toggleStatus(ngo.address, ngo.isActive)}
                      size="sm"
                      variant={ngo.isActive ? "outline" : "primary"}
                      className={ngo.isActive ? "border-red-200 text-red-600 hover:bg-red-50" : "bg-green-600 text-white"}
                      isLoading={isLoading}
                    >
                      {ngo.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
