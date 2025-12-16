import { Skeleton } from "@/components/ui/skeleton";

interface FormSkeletonProps {
  fields?: number;
  title?: boolean;
  description?: boolean;
  button?: boolean;
  doubleColumn?: boolean;
}

export function FormSkeleton({
  fields = 5,
  title = true,
  description = true,
  button = true,
  doubleColumn = false,
}: FormSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      {title && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-50" />
          {description && <Skeleton className="h-4 w-75" />}
        </div>
      )}

      {/* Form Fields */}
      <div
        className={`
        grid gap-6
        ${doubleColumn ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}
      `}
      >
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-25" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Form Footer with Button */}
      {button && (
        <div className="flex justify-end gap-4 pt-4">
          <Skeleton className="h-10 w-25" />
          <Skeleton className="h-10 w-25" />
        </div>
      )}
    </div>
  );
}

// Variant for Card Forms
export function CardFormSkeleton(props: FormSkeletonProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <FormSkeleton {...props} />
    </div>
  );
}

// Variant for Inline Forms
export function InlineFormSkeleton(props: FormSkeletonProps) {
  return (
    <div className="flex flex-col gap-4">
      <FormSkeleton {...props} doubleColumn={true} />
    </div>
  );
}
