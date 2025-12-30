"use client";

import { AppData } from "@/lib/db";
import { Edit, ExternalLink, Trash2, X } from "lucide-react";
import { useState } from "react";

interface AppDetailModalProps {
    app: AppData | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (app: AppData) => void;
    onDelete: (app: AppData) => void;
}

export function AppDetailModal({ app, isOpen, onClose, onEdit, onDelete }: AppDetailModalProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (!isOpen || !app) return null;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Live':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Beta':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-[#0a0a1a] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto shadow-2xl animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="sticky top-0 bg-[#0a0a1a] border-b border-white/5 p-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden relative border border-white/10">
                            {app.logoUrl ? (
                                <img src={app.logoUrl} alt={app.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-white font-bold text-lg">{app.name.substring(0, 1)}</div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">{app.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-500">/{app.slug}</span>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${getStatusStyle(app.status)}`}>
                                    {app.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Screenshots */}
                    {app.screenshots && app.screenshots.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Screenshots</h3>
                            <div className="space-y-3">
                                <div className="aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 relative">
                                    <img
                                        src={app.screenshots[activeImageIndex]}
                                        alt={`Screenshot ${activeImageIndex + 1}`}
                                        className="w-full h-full object-contain absolute"
                                    />
                                </div>
                                {app.screenshots.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {app.screenshots.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveImageIndex(i)}
                                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImageIndex
                                                    ? 'border-purple-500'
                                                    : 'border-white/10 opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Short Description</h3>
                            <p className="text-white/90 text-sm">{app.shortDescription}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Category & Developer</h3>
                            <div className="flex flex-col gap-1">
                                <p className="text-white/90 text-sm"><span className="text-gray-500">Category:</span> {app.category}</p>
                                <p className="text-white/90 text-sm"><span className="text-gray-500">Developer:</span> {app.developer}</p>
                                <p className="text-white/90 text-sm"><span className="text-gray-500">Version:</span> {app.version}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Full Description</h3>
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{app.fullDescription}</p>
                    </div>

                    {/* Features */}
                    {app.features && app.features.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Features</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {app.features.map((feature, i) => (
                                    <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-purple-400 text-xs font-mono">{feature.icon}</span>
                                            <span className="font-medium text-white text-sm">{feature.title}</span>
                                        </div>
                                        <p className="text-gray-400 text-xs">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* IDs & Links */}
                    <div className="text-xs text-gray-600 font-mono pt-4 border-t border-white/5">
                        <p>ID: {app.id}</p>
                        <p>Created: {app.createdAt?.toString() || 'N/A'}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-[#0a0a1a] border-t border-white/5 p-6 flex items-center justify-between">
                    <button
                        onClick={() => onDelete(app)}
                        className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                    <div className="flex items-center gap-3">
                        <a
                            href={`/apps/${app.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/10 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View Public Page
                        </a>
                        <button
                            onClick={() => onEdit(app)}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"
                        >
                            <Edit className="w-4 h-4" />
                            Edit App
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
