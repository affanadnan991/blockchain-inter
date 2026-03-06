'use client'

import { useState } from 'react'
import { FaBuilding, FaEnvelope, FaGlobe, FaFileUpload, FaCheckCircle, FaChevronRight } from 'react-icons/fa'
import Button from '../../components/ui/Button'
import Link from 'next/link'

export default function RegisterNGOPage() {
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        website: '',
        address: '',
        mission: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // send application to a simple API endpoint so administrators can see it
            const res = await fetch('/api/ngo-applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                throw new Error('Server rejected the application')
            }

            setSubmitted(true)
        } catch (err) {
            console.error('failed to submit NGO application', err)
            // you could show a toast here, add react-hot-toast if needed
            alert('Unable to send application – try again later.')
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Application Received!</h2>
                    <p className="text-gray-600">
                        Thank you for applying to join GiveHope. Our team will review your organization's credentials and contact you within 3-5 business days.
                    </p>
                    <Link href="/">
                        <Button className="w-full mt-6">Return Home</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20 pt-32">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Join Our Trusted <span className="text-green-600">Network</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Register your NGO to start receiving transparent, blockchain-verified donations from supporters around the world.
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-12">
                    {/* Process Info */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-green-600 rounded-3xl p-8 text-white shadow-xl shadow-green-200">
                            <h3 className="text-xl font-bold mb-6">The Benefits</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <FaCheckCircle className="mt-1 flex-shrink-0 text-green-300" />
                                    <span className="text-sm">100% Transparent Fund Tracking</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaCheckCircle className="mt-1 flex-shrink-0 text-green-300" />
                                    <span className="text-sm">Global Donor Exposure</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaCheckCircle className="mt-1 flex-shrink-0 text-green-300" />
                                    <span className="text-sm">Multi-sig Wallet Security</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaCheckCircle className="mt-1 flex-shrink-0 text-green-300" />
                                    <span className="text-sm">Low Transaction Fees</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Registration Process</h3>
                            <div className="space-y-6">
                                {[
                                    { step: 1, title: 'Apply', desc: 'Submit your organization details' },
                                    { step: 2, title: 'Verify', desc: 'Our team reviews your credentials' },
                                    { step: 3, title: 'Launch', desc: 'Set up your multisig wallet and go live' }
                                ].map(s => (
                                    <div key={s.step} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                                            {s.step}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">{s.title}</div>
                                            <div className="text-xs text-gray-500">{s.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-2xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Organization Name</label>
                                    <div className="relative">
                                        <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 transition-all"
                                            placeholder="Global Relief Foundation"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Official Email Address</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 transition-all"
                                            placeholder="contact@foundation.org"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Website URL</label>
                                        <div className="relative">
                                            <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                required
                                                value={formData.website}
                                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 transition-all"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Main Wallet Address</label>
                                        <div className="relative">
                                            <input
                                                required
                                                value={formData.address}
                                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 transition-all font-mono text-sm"
                                                placeholder="0x..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Mission Statement</label>
                                    <textarea
                                        required
                                        value={formData.mission}
                                        onChange={e => setFormData({ ...formData, mission: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 transition-all min-h-[120px]"
                                        placeholder="Briefly describe your goals and impact..."
                                    />
                                </div>

                                <Button type="submit" className="w-full py-4 bg-green-600 hover:bg-green-700 shadow-xl shadow-green-100 flex items-center justify-center gap-2">
                                    Submit Application <FaChevronRight size={12} />
                                </Button>

                                <p className="text-center text-xs text-gray-400">
                                    By submitting, you agree to our verification protocols and transparency requirements.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
