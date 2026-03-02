'use client'

import { useState } from 'react'
import { FaPlus, FaCheck, FaTimes, FaLink, FaFingerprint } from 'react-icons/fa'
import { useAdmin } from '../../hooks/useAdmin'
import { useNGOData } from '../../hooks/useNGOData'
import Button from '../../components/ui/Button'
import useIsOwner from '../../hooks/useIsOwner'

export default function NGOManagement() {
  const { registerNGO, updateNGOStatus, updateMinApprovals, manageNGOApprover, pauseNGOWithdrawals, isLoading } = useAdmin()
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
  const [editingNGO, setEditingNGO] = useState(null)
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

  const openEditor = (ngo) => {
    setEditingNGO({
      ...ngo,
      // local copy fields for edits
      minApprovals: ngo.minApprovals,
      approverInput: ''
    })
  }

  const closeEditor = () => {
    setEditingNGO(null)
  }

  const handleMinApprovalsChange = async () => {
    try {
      await updateMinApprovals(editingNGO.address, Number(editingNGO.minApprovals))
      closeEditor()
      refresh()
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddApprover = async () => {
    if (!editingNGO.approverInput) return
    try {
      await manageNGOApprover(editingNGO.address, editingNGO.approverInput, true)
      closeEditor()
      refresh()
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemoveApprover = async () => {
    if (!editingNGO.approverInput) return
    try {
      await manageNGOApprover(editingNGO.address, editingNGO.approverInput, false)
      closeEditor()
      refresh()
    } catch (err) {
      console.error(err)
    }
  }

  const handlePauseToggle = async () => {
    try {
      await pauseNGOWithdrawals(editingNGO.address, !editingNGO.withdrawalsPaused)
      closeEditor()
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

      {editingNGO && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Configure NGO</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-gray-700">Address:</div>
                <div className="text-xs font-mono text-gray-500">{editingNGO.address}</div>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Min Approvals</label>
                <input
                  type="number"
                  min="1"
                  value={editingNGO.minApprovals}
                  onChange={e => setEditingNGO({ ...editingNGO, minApprovals: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Approver Address</label>
                <div className="flex gap-2">
                  <input
                    value={editingNGO.approverInput}
                    onChange={e => setEditingNGO({ ...editingNGO, approverInput: e.target.value })}
                    placeholder="0x..."
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-none focus:ring-2 focus:ring-green-500"
                  />
                  <Button size="sm" onClick={handleAddApprover} className="bg-green-600 text-white">Add</Button>
                  <Button size="sm" onClick={handleRemoveApprover} variant="outline">Remove</Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Current approver count: {editingNGO.approversCount}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-bold text-gray-700">Withdrawals Paused?</label>
                <button
                  onClick={handlePauseToggle}
                  className={`px-3 py-1 rounded-full text-xs ${editingNGO.withdrawalsPaused ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                  type="button"
                >
                  {editingNGO.withdrawalsPaused ? 'Unpause' : 'Pause'}
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button onClick={handleMinApprovalsChange} className="bg-blue-600 text-white">Save</Button>
              <Button variant="outline" onClick={closeEditor}>Cancel</Button>
            </div>
          </div>
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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Withdrawals</th>
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
                        <div className="font-bold text-gray-900">
                          {ngo.nameHash ? `${ngo.nameHash.slice(0,6)}...` : ngo.address.slice(0, 10) + '...'}
                        </div>
                        <div className="text-sm font-mono text-gray-500">{ngo.address.slice(0, 10)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm font-bold text-gray-900">{ngo.minApprovals} / {ngo.approversCount}</div>
                    <div className="text-xs text-gray-500">Min approvals / approvers</div>
                  </td>
                  <td className="px-6 py-6">
                    {ngo.isActive ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">ACTIVE</span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">INACTIVE</span>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    {ngo.withdrawalsPaused ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">PAUSED</span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">OPEN</span>
                    )}
                  </td>
                  <td className="px-6 py-6 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditor(ngo)}
                    >
                      Configure
                    </Button>
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
