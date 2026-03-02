import toast from 'react-hot-toast'

// Wrapper functions for consistent toast usage across the app
export const showToast = {
  success: (message, duration = 4000) => {
    toast.success(message, {
      duration,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '0.5rem',
        padding: '1rem',
        fontWeight: '500'
      }
    })
  },

  error: (message, duration = 4000) => {
    toast.error(message, {
      duration,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        borderRadius: '0.5rem',
        padding: '1rem',
        fontWeight: '500'
      }
    })
  },

  warning: (message, duration = 4000) => {
    toast.loading(message, {
      duration,
      position: 'top-right',
      style: {
        background: '#f59e0b',
        color: '#fff',
        borderRadius: '0.5rem',
        padding: '1rem',
        fontWeight: '500'
      }
    })
  },

  info: (message, duration = 4000) => {
    toast(message, {
      duration,
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: '#fff',
        borderRadius: '0.5rem',
        padding: '1rem',
        fontWeight: '500'
      }
    })
  },

  loading: (message) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6b7280',
        color: '#fff',
        borderRadius: '0.5rem',
        padding: '1rem',
        fontWeight: '500'
      }
    })
  },

  dismiss: (toastId) => {
    if (toastId) {
      toast.dismiss(toastId)
    }
  }
}

// Default export for convenience
export default toast
