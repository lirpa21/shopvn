import { Loader2 } from "lucide-react";

export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Profile header */}
      <div className="bg-card rounded-3xl border p-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-secondary/60" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-40 bg-secondary/60 rounded" />
            <div className="h-4 w-56 bg-secondary/40 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="h-3 w-16 bg-secondary/40 rounded mx-auto" />
              <div className="h-7 w-10 bg-secondary/60 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Tab buttons */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-secondary/60 rounded-xl" />
        ))}
      </div>

      {/* Content */}
      <div className="bg-card rounded-2xl border p-6 space-y-4">
        <div className="h-6 w-36 bg-secondary/60 rounded" />
        <div className="space-y-3 max-w-lg">
          <div className="h-10 bg-secondary/40 rounded-xl" />
          <div className="h-10 bg-secondary/40 rounded-xl" />
          <div className="h-10 bg-secondary/40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
