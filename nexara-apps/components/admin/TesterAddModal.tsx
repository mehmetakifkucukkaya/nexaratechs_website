"use client";

import { useState } from "react";
import { X, User, Mail, Smartphone, Save, Loader2, Plus, AlertCircle } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "./Toast";

interface TesterAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function TesterAddModal({ isOpen, onClose, onSuccess }: TesterAddModalProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [device, setDevice] = useState('Android');
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
    const [touched, setTouched] = useState<{ fullName?: boolean; email?: boolean }>({});
    const { showToast } = useToast();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateField = (field: 'fullName' | 'email', value: string) => {
        if (field === 'fullName') {
            if (!value.trim()) return 'Full name is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            return undefined;
        }
        if (field === 'email') {
            if (!value.trim()) return 'Email is required';
            if (!validateEmail(value.trim())) return 'Please enter a valid email';
            return undefined;
        }
    };

    const handleBlur = (field: 'fullName' | 'email') => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const value = field === 'fullName' ? fullName : email;
        setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
    };

    const handleChange = (field: 'fullName' | 'email', value: string) => {
        if (field === 'fullName') setFullName(value);
        else setEmail(value);

        if (touched[field]) {
            setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
        }
    };

    const resetForm = () => {
        setFullName('');
        setEmail('');
        setDevice('Android');
        setErrors({});
        setTouched({});
    };

    const handleSave = async () => {
        // Validate all fields
        const newErrors = {
            fullName: validateField('fullName', fullName),
            email: validateField('email', email)
        };
        setErrors(newErrors);
        setTouched({ fullName: true, email: true });

        if (newErrors.fullName || newErrors.email) {
            showToast("Please fix the errors before submitting", "error");
            return;
        }

        setSaving(true);
        try {
            await addDoc(collection(db, "testers"), {
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                device,
                status: 'pending',
                appliedAt: serverTimestamp()
            });
            showToast("Tester added successfully", "success");
            resetForm();
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error adding tester:", error);
            showToast("Failed to add tester", "error");
        }
        setSaving(false);
    };

    if (!isOpen) return null;

    const getInputClass = (field: 'fullName' | 'email') => {
        const base = "w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none transition-all";
        if (touched[field] && errors[field]) {
            return `${base} border-red-500/50 focus:ring-2 focus:ring-red-500/50`;
        }
        return `${base} border-white/10 focus:ring-2 focus:ring-purple-500/50`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-[#0a0a1a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="border-b border-white/5 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Add New Tester</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <span className="flex items-center gap-2">
                                <User className="w-4 h-4" /> Full Name *
                            </span>
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                            onBlur={() => handleBlur('fullName')}
                            placeholder="John Doe"
                            className={getInputClass('fullName')}
                        />
                        {touched.fullName && errors.fullName && (
                            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.fullName}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <span className="flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Email *
                            </span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            placeholder="john@example.com"
                            className={getInputClass('email')}
                        />
                        {touched.email && errors.email && (
                            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Device */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <span className="flex items-center gap-2">
                                <Smartphone className="w-4 h-4" /> Device Type
                            </span>
                        </label>
                        <div className="flex gap-2">
                            {['Android', 'iOS'].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDevice(d)}
                                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${device === d
                                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-white/5 p-6 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Add Tester
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
