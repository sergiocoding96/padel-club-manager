export default function GroupsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-stone-100 animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-24 bg-stone-100 rounded animate-pulse" />
                <div className="h-4 w-40 bg-stone-100 rounded animate-pulse hidden sm:block" />
              </div>
            </div>
            <div className="h-10 w-28 bg-stone-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-stone-200/60 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-stone-100 animate-pulse" />
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-7 w-12 bg-stone-100 rounded animate-pulse" />
                <div className="h-4 w-20 bg-stone-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Groups List Skeleton */}
        <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6">
          {/* Toolbar Skeleton */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="h-10 w-72 bg-stone-100 rounded-xl animate-pulse" />
              <div className="h-10 w-24 bg-stone-100 rounded-xl animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-32 bg-stone-100 rounded-xl animate-pulse" />
              <div className="h-10 w-20 bg-stone-100 rounded-xl animate-pulse" />
            </div>
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl bg-white border border-stone-200/60 shadow-sm"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-stone-200 animate-pulse" />
                <div className="p-5 pl-6">
                  {/* Header skeleton */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <div className="h-6 w-3/4 bg-stone-200 rounded-lg animate-pulse mb-2" />
                      <div className="h-6 w-24 bg-stone-100 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-3 w-3 bg-stone-200 rounded-full animate-pulse" />
                  </div>

                  {/* Info grid skeleton */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-stone-100 animate-pulse" />
                      <div className="h-4 w-20 bg-stone-100 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-stone-100 animate-pulse" />
                      <div className="h-4 w-16 bg-stone-100 rounded animate-pulse" />
                    </div>
                  </div>

                  {/* Capacity skeleton */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="h-4 w-12 bg-stone-100 rounded animate-pulse" />
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full" />
                  </div>

                  {/* Footer skeleton */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <div className="h-5 w-14 bg-stone-100 rounded-full animate-pulse" />
                    <div className="h-4 w-20 bg-stone-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
