export default function CollectionsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Hero banner */}
      <div className="rounded-3xl bg-secondary/60 h-[200px] mb-8" />

      {/* Category grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card rounded-2xl border overflow-hidden">
            <div className="aspect-[4/3] bg-secondary/60" />
            <div className="p-4 space-y-2">
              <div className="h-5 bg-secondary/60 rounded w-2/3" />
              <div className="h-3 bg-secondary/40 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
