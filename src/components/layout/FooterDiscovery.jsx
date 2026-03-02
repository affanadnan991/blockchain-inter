'use client'

import React from 'react'
import Link from 'next/link'

export default function FooterDiscovery() {
  return (
    <div className="lg:col-span-1">
      <h4 className="font-bold text-gray-900 mb-6">Discovery</h4>
      <ul className="space-y-4">
        <li><Link href="/ngos" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Find NGOs</Link></li>
        <li><Link href="/success-stories" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Success Stories</Link></li>
        <li><Link href="/impact-reports" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Impact Reports</Link></li>
      </ul>
    </div>
  )
}
