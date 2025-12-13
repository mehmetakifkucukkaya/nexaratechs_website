"use client";

import { useEffect } from "react";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Admin panel error:", error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
                        <svg
                            className="w-7 h-7 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Admin Panel Error
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Something went wrong while loading this section.
                    </p>
                    {process.env.NODE_ENV === "development" && error.message && (
                        <div className="mb-4 p-3 bg-gray-100 rounded-lg text-left">
                            <p className="text-xs font-mono text-red-600 break-all">
                                {error.message}
                            </p>
                        </div>
                    )}
                </div>
                <button
                    onClick={reset}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
