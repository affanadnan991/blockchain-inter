'use client'

import React from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaCode, FaGithub, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'

export default function SmartContractPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 font-semibold">
              <FaArrowLeft size={16} />
              Back to Home
            </Link>

            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Contract</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Open source, audited, and deployed on Polygon. View the complete source code and security certifications.
              </p>
            </div>
          </div>

          {/* Contract Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <FaCode size={20} />
                </div>
                <h3 className="font-bold text-gray-900">Open Source</h3>
              </div>
              <p className="text-gray-600 text-sm">All code is publicly available on GitHub for community review and contribution.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <FaShieldAlt size={20} />
                </div>
                <h3 className="font-bold text-gray-900">Security Audited</h3>
              </div>
              <p className="text-gray-600 text-sm">Professional audits completed by leading blockchain security firms.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <FaCheckCircle size={20} />
                </div>
                <h3 className="font-bold text-gray-900">Production Ready</h3>
              </div>
              <p className="text-gray-600 text-sm">Battle-tested in production with multi-million dollar TVL.</p>
            </div>
          </div>

          {/* Contract Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Contract Details</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Network:</span>
                  <span className="text-gray-900">Polygon (137)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Contract:</span>
                  <span className="text-gray-900 font-mono text-sm">0xDonation...</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Standard:</span>
                  <span className="text-gray-900">ERC20 Compatible</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Deployed:</span>
                  <span className="text-gray-900">January 2026</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Multi-signature withdrawal approval system</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Support for unlimited ERC20 tokens</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Reentrancy guard protection</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">On-chain transaction logging</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Emergency pause functionality</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaGithub size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-3">View on GitHub</h2>
            <p className="text-green-50 mb-6">Read the source code, contribute, and help improve the protocol.</p>
            <a href="#" className="inline-block px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-50 transition-all">
              Open Repository
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}