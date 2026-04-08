export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-40 bg-secondary/60 rounded mb-6" />

      {/* Title + Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-56 bg-secondary/60 rounded-lg" />
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-secondary/60 rounded-lg" />
          <div className="h-9 w-20 bg-secondary/60 rounded-lg" />
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-card rounded-2xl border overflow-hidden">
            <div className="aspect-square bg-secondary/60" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-secondary/60 rounded w-4/5" />
              <div className="h-3 bg-secondary/40 rounded w-2/5" />
              <div className="h-5 bg-secondary/60 rounded w-1/3 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
