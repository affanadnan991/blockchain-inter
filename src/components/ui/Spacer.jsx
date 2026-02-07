const Spacer = ({ size = 'md', axis = 'vertical', className = '' }) => {
  const sizes = {
    xs: 'h-2 w-2',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
    '2xl': 'h-16 w-16',
  }

  const axisStyles = {
    vertical: 'w-full',
    horizontal: 'h-full',
    both: ''
  }

  return (
    <div
      className={`
        ${axisStyles[axis]}
        ${sizes[size]}
        ${className}
      `}
      aria-hidden="true"
    />
  )
}

export default Spacer