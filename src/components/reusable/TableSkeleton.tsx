import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showHeader?: boolean;
  showPagination?: boolean;
  className?: string;
}

export default function TableSkeleton({
  columns = 6,
  rows = 5,
  showHeader = true,
  showPagination = true,
  className = "",
}: TableSkeletonProps) {
  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Optional header row (search, filters, etc.) */}
      {showHeader && (
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-50" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-25" />
            <Skeleton className="h-10 w-25" />
          </div>
        </div>
      )}

      {/* Table column headers */}
      <div className={`grid grid-cols-${columns} gap-4`}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-6 w-full" />
        ))}
      </div>

      {/* Table body rows */}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`grid grid-cols-${columns} gap-4`}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-10 w-full"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Optional pagination controls */}
      {showPagination && (
        <div className="flex justify-end gap-2 mt-4">
          <Skeleton className="h-10 w-10 rounded" />
          <Skeleton className="h-10 w-10 rounded" />
          <Skeleton className="h-10 w-10 rounded" />
        </div>
      )}
    </div>
  );
}
