export default function AdminLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div className="h-8 w-48 bg-gray-200 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
            </div>

            {/* Stats grid skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-xl border bg-white p-6">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-20 bg-gray-100 rounded"></div>
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div className="rounded-xl border bg-white">
                <div className="p-6 border-b">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="p-6 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1">
                                <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 w-32 bg-gray-100 rounded"></div>
                            </div>
                            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
