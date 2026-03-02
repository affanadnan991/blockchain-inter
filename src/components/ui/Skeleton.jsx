'use client'

const Skeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`} />
)

export function CardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
      <Skeleton className="mb-4" height="h-6" width="w-32" />
      <Skeleton className="mb-2" height="h-4" width="w-full" />
      <Skeleton height="h-4" width="w-3/4" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton width="w-20" />
          <Skeleton width="w-32" />
          <Skeleton width="w-24" />
          <Skeleton width="w-16" />
        </div>
      ))}
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <Skeleton width="w-24" height="h-4" className="mb-2" />
          <Skeleton height="h-10" />
        </div>
      ))}
    </div>
  )
}

export default Skeleton
