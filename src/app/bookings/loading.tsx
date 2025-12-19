export default function BookingsLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="max-w-full mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-stone-200 rounded-lg animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-stone-200 rounded animate-pulse" />
              <div className="w-48 h-7 bg-stone-200 rounded animate-pulse" />
              <div className="w-8 h-8 bg-stone-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-48 h-10 bg-stone-200 rounded-lg animate-pulse" />
            <div className="w-32 h-10 bg-stone-200 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Calendar Skeleton */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
          {/* Day Headers */}
          <div className="flex border-b border-stone-200">
            <div className="w-16 shrink-0 h-16 bg-stone-50 border-r border-stone-200" />
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="flex-1 min-w-[120px] h-16 bg-white border-r border-stone-200 last:border-r-0 flex flex-col items-center justify-center"
              >
                <div className="w-8 h-3 bg-stone-200 rounded animate-pulse mb-2" />
                <div className="w-6 h-5 bg-stone-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Grid Rows */}
          {[1, 2, 3].map((row) => (
            <div key={row} className="flex border-b border-stone-200 last:border-b-0">
              <div className="w-16 shrink-0 border-r border-stone-200 bg-stone-50">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
                  <div key={slot} className="h-10 flex items-start justify-end pr-2">
                    {slot % 2 === 1 && (
                      <div className="w-8 h-3 bg-stone-200 rounded animate-pulse -mt-1" />
                    )}
                  </div>
                ))}
              </div>
              {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                <div
                  key={col}
                  className="flex-1 min-w-[120px] border-r border-stone-200 last:border-r-0"
                >
                  {/* Court Header */}
                  <div className="h-12 flex items-center justify-center gap-2 border-b border-stone-200 bg-white">
                    <div className="w-6 h-6 bg-stone-200 rounded animate-pulse" />
                    <div className="w-16 h-4 bg-stone-200 rounded animate-pulse" />
                  </div>
                  {/* Time Slots */}
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
                    <div
                      key={slot}
                      className="h-10 border-b border-stone-100"
                    >
                      {/* Random booking placeholders */}
                      {slot === 2 && col === 2 && (
                        <div className="mx-1 mt-0.5 h-[60px] bg-emerald-100 rounded-md animate-pulse" />
                      )}
                      {slot === 4 && col === 5 && (
                        <div className="mx-1 mt-0.5 h-[40px] bg-purple-100 rounded-md animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
