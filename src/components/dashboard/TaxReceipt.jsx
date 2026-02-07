'use client'

import { useState } from 'react'
import { FaDownload, FaPrint, FaEnvelope, FaFilePdf } from 'react-icons/fa'
import Button from '../ui/Button'

const TaxReceipt = () => {
  const [receipts, setReceipts] = useState([
    {
      id: '2024-001',
      period: 'January 2024',
      amount: 250.00,
      date: '2024-01-15',
      status: 'available',
      downloadUrl: '#'
    },
    {
      id: '2023-004',
      period: 'Q4 2023',
      amount: 750.00,
      date: '2023-12-31',
      status: 'available',
      downloadUrl: '#'
    },
    {
      id: '2023-003',
      period: 'Q3 2023',
      amount: 500.00,
      date: '2023-09-30',
      status: 'available',
      downloadUrl: '#'
    }
  ])

  const handleDownload = (receiptId) => {
    alert(`Downloading receipt ${receiptId}...`)
    // Implement actual download logic
  }

  const handlePrint = (receiptId) => {
    alert(`Printing receipt ${receiptId}...`)
    // Implement print functionality
  }

  const handleEmail = (receiptId) => {
    alert(`Sending receipt ${receiptId} to email...`)
    // Implement email functionality
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Tax Receipts</h3>
          <p className="text-gray-600">Blockchain-verified donation receipts for tax purposes</p>
        </div>
        <Button variant="outline">
          <FaFilePdf className="mr-2" />
          Generate Annual Summary
        </Button>
      </div>

      <div className="space-y-4">
        {receipts.map((receipt) => (
          <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50">
            <div>
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <FaFilePdf className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Receipt {receipt.id}</h4>
                  <p className="text-sm text-gray-600">
                    {receipt.period} • ${receipt.amount.toFixed(2)} total
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload(receipt.id)}
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
                title="Download PDF"
              >
                <FaDownload />
              </button>
              <button
                onClick={() => handlePrint(receipt.id)}
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
                title="Print"
              >
                <FaPrint />
              </button>
              <button
                onClick={() => handleEmail(receipt.id)}
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
                title="Email"
              >
                <FaEnvelope />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tax Information */}
      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="font-bold text-blue-900 mb-3">Tax Information</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• All receipts are blockchain-verified and legally valid</li>
          <li>• Deductible under Section 61 of Income Tax Ordinance (Pakistan)</li>
          <li>• International donors: Check your country's tax laws</li>
          <li>• Receipts generated automatically after each donation</li>
        </ul>
      </div>
    </div>
  )
}

export default TaxReceipt