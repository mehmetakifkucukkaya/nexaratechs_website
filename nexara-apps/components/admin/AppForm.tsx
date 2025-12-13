"use client";

import { useForm } from "react-hook-form";
import { AppData } from "@/lib/db";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, doc, updateDoc, collection } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Upload, Save, AlertCircle, Loader2, Image } from "lucide-react";
import Link from "next/link";

// File validation constants
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface AppFormProps {
    initialData?: AppData;
    isEdit?: boolean;
}

// Validate uploaded file
function validateFile(file: File): string | null {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return `Invalid file type: ${file.type}. Allowed types: PNG, JPEG, WebP, GIF`;
    }
    if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        return `File too large: ${sizeMB}MB. Maximum size: 5MB`;
    }
    return null;
}

// Generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[ğ]/g, 'g')
        .replace(/[ü]/g, 'u')
        .replace(/[ş]/g, 's')
        .replace(/[ı]/g, 'i')
        .replace(/[ö]/g, 'o')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export default function AppForm({ initialData, isEdit = false }: AppFormProps) {
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<AppData>({
        defaultValues: initialData || {
            title: "",
            slug: "",
            playStoreUrl: "",
            status: "live",
            order: 1,
            description: { tr: "", en: "" }
        }
    });

    const [loading, setLoading] = useState(false);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [autoSlug, setAutoSlug] = useState(!isEdit);
    const router = useRouter();

    // Watch title and auto-generate slug
    const title = watch('title');
    const currentSlug = watch('slug');

    // Auto-generate slug when title changes (only if autoSlug is enabled)
    useState(() => {
        if (autoSlug && title) {
            setValue('slug', generateSlug(title));
        }
    });

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        if (autoSlug) {
            setValue('slug', generateSlug(newTitle));
        }
    };

    const handleSlugChange = () => {
        // User manually edited slug, disable auto-generation
        setAutoSlug(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFileError(null);

        if (file) {
            const error = validateFile(file);
            if (error) {
                setFileError(error);
                setIconFile(null);
                e.target.value = '';
                return;
            }
        }

        setIconFile(file);
    };

    const onSubmit = async (data: AppData) => {
        setLoading(true);
        setSubmitError(null);

        try {
            let iconUrl = initialData?.iconUrl || "";

            if (iconFile) {
                const validationError = validateFile(iconFile);
                if (validationError) {
                    setSubmitError(validationError);
                    setLoading(false);
                    return;
                }

                const storageRef = ref(storage, `icons/${Date.now()}-${iconFile.name}`);
                const snapshot = await uploadBytes(storageRef, iconFile);
                iconUrl = await getDownloadURL(snapshot.ref);
            }

            const payload = {
                ...data,
                iconUrl,
                order: Number(data.order)
            };

            if (isEdit && initialData?.id) {
                await updateDoc(doc(db, "apps", initialData.id), payload);
            } else {
                await addDoc(collection(db, "apps"), payload);
            }

            router.push("/admin/apps");
            router.refresh();
        } catch (error) {
            console.error("Error saving app:", error);
            setSubmitError(error instanceof Error ? error.message : "Error saving app. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all";
    const labelClass = "block text-sm font-medium text-gray-300 mb-2";
    const errorClass = "mt-2 text-sm text-red-400 flex items-center gap-1";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 p-6 md:p-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* Icon Upload */}
                    <div className="md:col-span-2">
                        <label className={labelClass}>App Icon</label>
                        <div className="flex items-center gap-4">
                            <label htmlFor="icon-upload" className="cursor-pointer group">
                                {initialData?.iconUrl && !iconFile ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={initialData.iconUrl} alt="Current Icon" className="h-16 w-16 rounded-xl object-cover border border-white/10 group-hover:border-purple-500/50 transition-colors" />
                                ) : iconFile ? (
                                    <div className="h-16 w-16 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
                                        <Image className="w-8 h-8 text-purple-400" />
                                    </div>
                                ) : (
                                    <div className="h-16 w-16 rounded-xl bg-white/5 flex items-center justify-center border border-dashed border-white/20 group-hover:border-purple-500/50 group-hover:bg-purple-500/5 transition-all">
                                        <Upload className="w-6 h-6 text-gray-500 group-hover:text-purple-400 transition-colors" />
                                    </div>
                                )}
                            </label>
                            <div className="flex-1">
                                <input
                                    id="icon-upload"
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.webp,.gif"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20 file:cursor-pointer file:transition-colors"
                                />
                                <p className="mt-1 text-xs text-gray-500">PNG, JPEG, WebP or GIF. Max 5MB.</p>
                            </div>
                        </div>
                        {fileError && (
                            <p className={errorClass}><AlertCircle className="w-4 h-4" /> {fileError}</p>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label className={labelClass}>App Title</label>
                        <input
                            {...register("title", { required: "Title is required", onChange: handleTitleChange })}
                            className={`${inputClass} ${errors.title ? 'border-red-500/50 ring-1 ring-red-500/50' : ''}`}
                            placeholder="My Awesome App"
                        />
                        {errors.title && <p className={errorClass}><AlertCircle className="w-4 h-4" /> {errors.title.message}</p>}
                    </div>

                    {/* Slug */}
                    <div>
                        <label className={labelClass}>
                            Slug (ID)
                            {autoSlug && <span className="ml-2 text-xs text-purple-400">(auto)</span>}
                        </label>
                        <input
                            {...register("slug", { required: "Slug is required", onChange: handleSlugChange })}
                            className={`${inputClass} ${errors.slug ? 'border-red-500/50 ring-1 ring-red-500/50' : ''}`}
                            placeholder="my-awesome-app"
                        />
                        {errors.slug && <p className={errorClass}><AlertCircle className="w-4 h-4" /> {errors.slug.message}</p>}
                    </div>

                    {/* Play Store URL */}
                    <div className="md:col-span-2">
                        <label className={labelClass}>Play Store URL</label>
                        <input
                            {...register("playStoreUrl", { required: "Play Store URL is required" })}
                            className={`${inputClass} ${errors.playStoreUrl ? 'border-red-500/50 ring-1 ring-red-500/50' : ''}`}
                            placeholder="https://play.google.com/store/apps/details?id=..."
                        />
                        {errors.playStoreUrl && <p className={errorClass}><AlertCircle className="w-4 h-4" /> {errors.playStoreUrl.message}</p>}
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2">
                        <label className={labelClass}>Status</label>
                        <select {...register("status")} className={inputClass}>
                            <option value="live" className="bg-[#0a0a1a]">Live</option>
                            <option value="closed_test" className="bg-[#0a0a1a]">Closed Test</option>
                            <option value="development" className="bg-[#0a0a1a]">Development</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className={labelClass}>Description</label>
                        <textarea
                            {...register("description.en")}
                            rows={4}
                            className={inputClass}
                            placeholder="Describe your app..."
                        />
                    </div>
                </div>
            </div>

            {/* Submit Error */}
            {submitError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-400">{submitError}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
                <Link
                    href="/admin/apps"
                    className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={loading || !!fileError}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            {isEdit ? 'Update App' : 'Create App'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

