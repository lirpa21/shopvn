export default function AdminLoading() {
  return (
    <div className="p-6 lg:p-8 animate-pulse">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-2xl border p-5">
            <div className="h-3 w-20 bg-secondary/60 rounded mb-3" />
            <div className="h-8 w-28 bg-secondary/60 rounded" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border p-6">
          <div className="h-5 w-32 bg-secondary/60 rounded mb-4" />
          <div className="h-[250px] bg-secondary/40 rounded-xl" />
        </div>
        <div className="bg-card rounded-2xl border p-6">
          <div className="h-5 w-32 bg-secondary/60 rounded mb-4" />
          <div className="h-[250px] bg-secondary/40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
