import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="text-8xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        404
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Page not found
                    </h1>
                    <p className="text-gray-600">
                        Sorry, we couldn&apos;t find the page you&apos;re looking for.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Go back home
                    </Link>
                    <Link
                        href="/apps"
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        View Apps
                    </Link>
                </div>
            </div>
        </div>
    );
}
