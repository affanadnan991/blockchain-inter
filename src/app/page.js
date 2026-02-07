'use client'

import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import Stats from '@/components/home/Stats'
import HowItWorks from '@/components/home/HowItWorks'
import FeaturedNGOs from '@/components/home/FeaturedNGOs'
import RecentDonations from '@/components/home/RecentDonations'

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      <Hero />
      <Stats />
      <Features />
      <FeaturedNGOs />
      <HowItWorks />
      <RecentDonations />
    </div>
  )
}