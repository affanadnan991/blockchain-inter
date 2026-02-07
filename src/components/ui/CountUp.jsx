'use client'

import { useState, useEffect } from 'react'

const CountUp = ({ end, duration = 2, separator = ',', prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTimestamp = null
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    
    window.requestAnimationFrame(step)
    
    return () => {
      startTimestamp = null
    }
  }, [end, duration])

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  }

  return (
    <span>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  )
}

export default CountUp