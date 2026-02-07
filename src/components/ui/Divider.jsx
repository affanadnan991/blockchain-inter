const Divider = ({ 
  thickness = 'thin',
  color = 'gray-200',
  margin = 'md',
  className = ''
}) => {
  const thicknessStyles = {
    thin: 'h-px',
    medium: 'h-0.5',
    thick: 'h-1'
  }

  const marginStyles = {
    none: 'my-0',
    xs: 'my-2',
    sm: 'my-4',
    md: 'my-6',
    lg: 'my-8',
    xl: 'my-12'
  }

  return (
    <hr
      className={`
        ${thicknessStyles[thickness]}
        bg-${color}
        ${marginStyles[margin]}
        border-0
        ${className}
      `}
    />
  )
}

export default Divider