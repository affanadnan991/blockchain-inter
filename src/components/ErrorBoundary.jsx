'use client'

import { Component } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center px-4 border border-red-200 rounded-lg bg-red-50 m-4">
          <div className="text-center max-w-sm">
            <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Component Error</h2>
            <p className="text-gray-600 text-sm mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
