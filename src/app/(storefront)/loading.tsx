export default function StorefrontLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Hero skeleton */}
      <div className="rounded-3xl bg-secondary/60 h-[400px] mb-12" />

      {/* Section title skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-48 bg-secondary/60 rounded-lg" />
        <div className="h-5 w-24 bg-secondary/60 rounded-lg" />
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card rounded-2xl border overflow-hidden">
            <div className="aspect-square bg-secondary/60" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-secondary/60 rounded w-3/4" />
              <div className="h-3 bg-secondary/40 rounded w-1/2" />
              <div className="h-5 bg-secondary/60 rounded w-1/3 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
