"use client";

import { useForm } from "react-hook-form";
import { AppData } from "@/lib/db";
import { useState, useEffect } from "react";
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
    const { register, handleSubmit, formState: { errors }, watch, setValue, control } = useForm<AppData>({
        defaultValues: initialData || {
            name: "",
            slug: "",
            developer: "NexaraTechs Team",
            shortDescription: "",
            fullDescription: "",
            logoUrl: "",
            screenshots: [],
            features: [],
            status: "Live",
            version: "1.0.0",
            releaseDate: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }),
            category: "Productivity",
            downloadUrl: "",
            privacyUrl: "",
            order: 1
        }
    });

    const [loading, setLoading] = useState(false);

    // Logo state
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>(initialData?.logoUrl || "");

    // Screenshot state
    const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
    const [existingScreenshots, setExistingScreenshots] = useState<string[]>(initialData?.screenshots || []);

    // Feature state
    const [features, setFeatures] = useState<{ title: string, description: string, icon: string }[]>(initialData?.features || []);

    const [submitError, setSubmitError] = useState<string | null>(null);
    const [autoSlug, setAutoSlug] = useState(!isEdit);
    const router = useRouter();

    // Watch name for auto-slug
    const name = watch('name');

    // Auto-generate slug when name changes
    useEffect(() => {
        if (autoSlug && name) {
            setValue('slug', generateSlug(name));
        }
    }, [name, autoSlug, setValue]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        if (autoSlug) {
            setValue('slug', generateSlug(newName));
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const error = validateFile(file);
            if (error) {
                alert(error);
                return;
            }
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleScreenshotFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles: File[] = [];
        for (const file of files) {
            if (validateFile(file)) continue; // Skip invalid
            validFiles.push(file);
        }
        setScreenshotFiles(prev => [...prev, ...validFiles]);
        e.target.value = '';
    };

    const removeScreenshotFile = (index: number) => {
        setScreenshotFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingScreenshot = (index: number) => {
        setExistingScreenshots(prev => prev.filter((_, i) => i !== index));
    };

    // Feature management
    const addFeature = () => {
        setFeatures([...features, { title: "", description: "", icon: "Star" }]);
    };

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const updateFeature = (index: number, field: keyof typeof features[0], value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFeatures(newFeatures);
    };

    const onSubmit = async (data: AppData) => {
        setLoading(true);
        setSubmitError(null);

        try {
            // Upload Logo
            let finalLogoUrl = data.logoUrl;
            if (logoFile) {
                const fileExtension = logoFile.name.split('.').pop() || 'png';
                const storagePath = `images/${data.slug}/logo.${fileExtension}`;
                const storageRef = ref(storage, storagePath);
                const snapshot = await uploadBytes(storageRef, logoFile);
                finalLogoUrl = await getDownloadURL(snapshot.ref);
            }

            // Upload Screenshots
            const uploadScreenshotsPromise = async () => {
                const currentImages = [...existingScreenshots];
                if (screenshotFiles.length > 0) {
                    const uploadPromises = screenshotFiles.map(async (file) => {
                        const fileExtension = file.name.split('.').pop() || 'png';
                        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                        const storagePath = `images/${data.slug}/screenshots/${uniqueId}.${fileExtension}`;
                        const storageRef = ref(storage, storagePath);
                        const snapshot = await uploadBytes(storageRef, file);
                        return await getDownloadURL(snapshot.ref);
                    });
                    const newUrls = await Promise.all(uploadPromises);
                    return [...currentImages, ...newUrls];
                }
                return currentImages;
            };

            const finalScreenshots = await uploadScreenshotsPromise();

            const payload: AppData = {
                ...data,
                logoUrl: finalLogoUrl,
                screenshots: finalScreenshots,
                features: features,
                order: Number(data.order)
            };

            if (isEdit && initialData?.id) {
                await updateDoc(doc(db, "apps", initialData.id), payload as any);
            } else {
                await addDoc(collection(db, "apps"), payload as any);
            }

            router.push("/admin/apps");
            router.refresh();
        } catch (error) {
            console.error("Error saving app:", error);
            setSubmitError(error instanceof Error ? error.message : "Error saving app.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all";
    const labelClass = "block text-sm font-medium text-gray-300 mb-2";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 p-6 md:p-8 space-y-6">

                {/* Logo Upload */}
                <div>
                    <label className={labelClass}>App Logo</label>
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative group">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <Upload className="w-8 h-8 text-gray-500" />
                            )}
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                <span className="text-xs text-white">Change</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                            </label>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-medium mb-1">Upload Logo</h3>
                            <p className="text-sm text-gray-500 mb-3">Recommended size: 512x512px. PNG or JPG.</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                    <div>
                        <label className={labelClass}>App Name</label>
                        <input
                            {...register("name", { required: "Name is required", onChange: handleNameChange })}
                            className={inputClass}
                            placeholder="Walletta"
                        />
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Slug</label>
                        <input
                            {...register("slug", { required: "Slug is required" })}
                            className={inputClass}
                            placeholder="walletta"
                            readOnly={autoSlug}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Developer</label>
                        <input
                            {...register("developer", { required: "Developer is required" })}
                            className={inputClass}
                            placeholder="NexaraTechs Team"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Category</label>
                        <input
                            {...register("category", { required: "Category is required" })}
                            className={inputClass}
                            placeholder="Finance"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Version</label>
                        <input
                            {...register("version", { required: "Version is required" })}
                            className={inputClass}
                            placeholder="1.0.0"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Release / Test Start Date</label>
                        <input
                            {...register("releaseDate", { required: "Date is required" })}
                            className={inputClass}
                            placeholder="10 December 2025"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Status</label>
                        <select {...register("status")} className={inputClass}>
                            <option value="Live" className="bg-[#0a0a1a]">Live</option>
                            <option value="Beta" className="bg-[#0a0a1a]">Beta</option>
                            <option value="Coming Soon" className="bg-[#0a0a1a]">Coming Soon</option>
                        </select>
                    </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-6 pt-4 border-t border-white/5">
                    <div>
                        <label className={labelClass}>Short Description</label>
                        <textarea
                            {...register("shortDescription", { required: "Short description is required" })}
                            className={inputClass}
                            rows={2}
                            placeholder="A brief tagline..."
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Full Description</label>
                        <textarea
                            {...register("fullDescription", { required: "Full description is required" })}
                            className={inputClass}
                            rows={6}
                            placeholder="Detailed explanation of the app..."
                        />
                    </div>
                </div>

                {/* Features */}
                <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <label className={labelClass}>Features</label>
                        <button type="button" onClick={addFeature} className="text-sm text-purple-400 hover:text-purple-300">
                            + Add Feature
                        </button>
                    </div>

                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                                <div className="flex justify-between">
                                    <h4 className="text-sm font-medium text-gray-400">Feature {index + 1}</h4>
                                    <button type="button" onClick={() => removeFeature(index)} className="text-red-400 text-xs">Remove</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        value={feature.title}
                                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                        placeholder="Title"
                                        className={inputClass}
                                    />
                                    <input
                                        value={feature.icon}
                                        onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                        placeholder="Icon Name (e.g. Star)"
                                        className={inputClass}
                                    />
                                </div>
                                <textarea
                                    value={feature.description}
                                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                    placeholder="Feature Description"
                                    className={inputClass}
                                    rows={2}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Screenshots */}
                <div className="pt-4 border-t border-white/5">
                    <label className={labelClass}>Screenshots</label>
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {existingScreenshots.map((url, i) => (
                                <div key={`existing-${i}`} className="relative group w-20 h-20">
                                    <img src={url} alt={`Screenshot ${i}`} className="w-full h-full object-cover rounded-lg border border-white/10" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingScreenshot(i)}
                                        className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <div className="w-3 h-3 flex items-center justify-center">×</div>
                                    </button>
                                </div>
                            ))}
                            {screenshotFiles.map((file, i) => (
                                <div key={`new-${i}`} className="relative group w-20 h-20">
                                    <img src={URL.createObjectURL(file)} alt={`New ${i}`} className="w-full h-full object-cover rounded-lg border border-purple-500/50" />
                                    <button
                                        type="button"
                                        onClick={() => removeScreenshotFile(i)}
                                        className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <div className="w-3 h-3 flex items-center justify-center">×</div>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleScreenshotFilesChange}
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20"
                        />
                    </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div>
                        <label className={labelClass}>Download URL</label>
                        <input
                            {...register("downloadUrl")}
                            className={inputClass}
                            placeholder="#"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Privacy URL</label>
                        <input
                            {...register("privacyUrl")}
                            className={inputClass}
                            placeholder="/privacy"
                        />
                    </div>
                </div>

            </div>

            {/* Error & Submit */}
            {submitError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {submitError}
                </div>
            )}

            <div className="flex items-center justify-end gap-4">
                <Link href="/admin/apps" className="px-5 py-2 text-gray-400 hover:text-white">Cancel</Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-xl hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isEdit ? 'Update App' : 'Create App'}
                </button>
            </div>
        </form>
    );
}
