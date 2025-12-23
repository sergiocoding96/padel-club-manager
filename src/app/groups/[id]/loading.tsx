export default function GroupDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back + Title */}
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-stone-100 animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-stone-100 rounded animate-pulse" />
                <div className="h-4 w-24 bg-stone-100 rounded animate-pulse hidden sm:block" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="h-10 w-24 bg-stone-100 rounded-lg animate-pulse" />
              <div className="h-10 w-10 bg-stone-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Card Skeleton */}
            <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
              {/* Color bar */}
              <div className="h-2 bg-stone-200 animate-pulse" />

              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-2">
                    <div className="h-7 w-48 bg-stone-200 rounded-lg animate-pulse" />
                    <div className="h-5 w-64 bg-stone-100 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-20 bg-stone-100 rounded-full animate-pulse" />
                </div>

                {/* Info Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
                      <div className="w-10 h-10 rounded-lg bg-stone-200 animate-pulse" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-16 bg-stone-200 rounded animate-pulse" />
                        <div className="h-5 w-20 bg-stone-100 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Schedule Section Skeleton */}
            <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-5 w-32 bg-stone-200 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-stone-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-9 w-28 bg-stone-100 rounded-lg animate-pulse" />
              </div>

              {/* Weekly Calendar Skeleton */}
              <div className="grid grid-cols-7 gap-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-4 w-8 mx-auto bg-stone-100 rounded animate-pulse mb-2" />
                    <div className="h-20 bg-stone-50 rounded-xl border border-stone-100 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Players Skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-5 w-24 bg-stone-200 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-stone-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-9 w-24 bg-stone-100 rounded-lg animate-pulse" />
              </div>

              {/* Capacity Bar Skeleton */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="h-4 w-16 bg-stone-100 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-stone-100 rounded animate-pulse" />
                </div>
                <div className="h-2 bg-stone-100 rounded-full animate-pulse" />
              </div>

              {/* Player List Skeleton */}
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-stone-50"
                  >
                    <div className="w-10 h-10 rounded-full bg-stone-200 animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-4 w-28 bg-stone-200 rounded animate-pulse" />
                      <div className="h-3 w-20 bg-stone-100 rounded animate-pulse" />
                    </div>
                    <div className="h-6 w-14 bg-stone-100 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Skeleton */}
            <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6">
              <div className="h-5 w-28 bg-stone-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-stone-100 rounded animate-pulse" />
                    <div className="h-5 w-16 bg-stone-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
