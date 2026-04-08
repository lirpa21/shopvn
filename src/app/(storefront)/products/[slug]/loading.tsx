export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-60 bg-secondary/60 rounded mb-8" />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image gallery skeleton */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl bg-secondary/60" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-secondary/40" />
            ))}
          </div>
        </div>

        {/* Product info skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-secondary/60 rounded w-3/4" />
          <div className="flex gap-2 items-center">
            <div className="h-4 w-20 bg-secondary/40 rounded" />
            <div className="h-4 w-16 bg-secondary/40 rounded" />
          </div>
          <div className="h-10 bg-secondary/60 rounded w-1/3" />
          <div className="space-y-2 mt-4">
            <div className="h-3 bg-secondary/40 rounded w-full" />
            <div className="h-3 bg-secondary/40 rounded w-5/6" />
            <div className="h-3 bg-secondary/40 rounded w-4/6" />
          </div>
          <div className="flex gap-3 mt-6">
            <div className="h-12 bg-secondary/60 rounded-xl flex-1" />
            <div className="h-12 w-12 bg-secondary/60 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
