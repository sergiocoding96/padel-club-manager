export default function CourtsLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-200 rounded-lg animate-pulse" />
            <div>
              <div className="h-7 w-24 bg-stone-200 rounded animate-pulse" />
              <div className="h-4 w-16 bg-stone-200 rounded animate-pulse mt-1" />
            </div>
          </div>
          <div className="h-10 w-32 bg-stone-200 rounded-lg animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-stone-200 p-5 animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-stone-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-5 w-24 bg-stone-200 rounded" />
                  <div className="h-4 w-16 bg-stone-200 rounded mt-2" />
                </div>
                <div className="h-6 w-20 bg-stone-200 rounded-full" />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-4 h-4 bg-stone-200 rounded" />
                <div className="h-4 w-32 bg-stone-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
