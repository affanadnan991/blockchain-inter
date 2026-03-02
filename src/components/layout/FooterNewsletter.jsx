'use client'

import React from 'react'

export default function FooterNewsletter() {
  return (
    <div className="lg:col-span-1">
      <h4 className="font-bold text-gray-900 mb-6">Stay Updated</h4>
      <p className="text-gray-500 text-sm mb-4">Join our community and help us grow the impact.</p>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Email address"
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 flex-1"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">
          Join
        </button>
      </div>
    </div>
  )
}