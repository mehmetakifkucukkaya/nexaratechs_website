"use client";

import { loginAdmin } from "@/lib/auth";
import { AlertCircle, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
    const router = useRouter();

    const validateEmail = (value: string) => {
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
        return undefined;
    };

    const validatePassword = (value: string) => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return undefined;
    };

    const handleBlur = (field: 'email' | 'password') => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const value = field === 'email' ? email : password;
        setFieldErrors(prev => ({ ...prev, [field]: field === 'email' ? validateEmail(value) : validatePassword(value) }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate before submit
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        setFieldErrors({ email: emailError, password: passwordError });
        setTouched({ email: true, password: true });

        if (emailError || passwordError) {
            return;
        }

        setLoading(true);

        try {
            const userCredential = await loginAdmin(email, password);
            const idToken = await userCredential.user.getIdToken();

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            });

            if (!response.ok) {
                throw new Error('Failed to create session');
            }

            router.push("/admin");
            router.refresh();
        } catch (err) {
            console.error('Login error:', err);
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-30%] right-[-20%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md mx-4">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 rounded-3xl blur-xl opacity-50" />

                <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6">
                            <img src="/logo.png" alt="NexaraTechs" className="h-24 w-24 object-contain hover:scale-105 transition-transform duration-300 drop-shadow-2xl" />
                        </Link>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400 text-sm">Sign in to access admin panel</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className={`w-5 h-5 ${touched.email && fieldErrors.email ? 'text-red-400' : 'text-gray-500'}`} />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        disabled={loading}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={() => handleBlur('email')}
                                        className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${touched.email && fieldErrors.email
                                            ? 'border-red-500/50 focus:ring-red-500/50'
                                            : 'border-white/10 focus:ring-purple-500/50 focus:border-purple-500/50'
                                            }`}
                                        placeholder="admin@example.com"
                                    />
                                </div>
                                {touched.email && fieldErrors.email && (
                                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className={`w-5 h-5 ${touched.password && fieldErrors.password ? 'text-red-400' : 'text-gray-500'}`} />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        disabled={loading}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={() => handleBlur('password')}
                                        className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${touched.password && fieldErrors.password
                                            ? 'border-red-500/50 focus:ring-red-500/50'
                                            : 'border-white/10 focus:ring-purple-500/50 focus:border-purple-500/50'
                                            }`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {touched.password && fieldErrors.password && (
                                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-[#0a0a1a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    {/* Back to home */}
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


