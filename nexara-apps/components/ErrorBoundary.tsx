"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        this.setState({ errorInfo });

        // Here you could send to an error reporting service like Sentry
        // if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        //     Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
        // }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="max-w-md w-full text-center space-y-6">
                        {/* Error Icon */}
                        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        {/* Error Message */}
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-foreground">
                                Bir şeyler ters gitti
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Bu sayfayı yüklerken bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
                            </p>
                        </div>

                        {/* Error Details (Development only) */}
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-left">
                                <p className="text-xs font-mono text-red-400 break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={this.handleReset}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Tekrar Dene
                            </button>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Ana Sayfa
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
