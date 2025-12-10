"use client";

import { useForm } from "react-hook-form";
import { AppData } from "@/lib/db";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, doc, updateDoc, collection } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface AppFormProps {
    initialData?: AppData;
    isEdit?: boolean;
}

export default function AppForm({ initialData, isEdit = false }: AppFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<AppData>({
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
    const router = useRouter();

    const onSubmit = async (data: AppData) => {
        setLoading(true);
        try {
            let iconUrl = initialData?.iconUrl || "";

            // Upload Icon if exists
            if (iconFile) {
                const storageRef = ref(storage, `icons/${Date.now()}-${iconFile.name}`);
                const snapshot = await uploadBytes(storageRef, iconFile);
                iconUrl = await getDownloadURL(snapshot.ref);
            }

            const payload = {
                ...data,
                iconUrl,
                // Ensure numbers are numbers
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
            alert("Error saving app. See console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg shadow max-w-2xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Icon</label>
                    <div className="mt-2 flex items-center gap-x-3">
                        {initialData?.iconUrl && !iconFile && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={initialData.iconUrl} alt="Current Icon" className="h-12 w-12 rounded-lg object-cover" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 from-neutral-200"
                        />
                    </div>
                </div>

                <div className="sm:col-span-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">App Title</label>
                    <div className="mt-2">
                        <input {...register("title", { required: true })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                    </div>
                </div>

                <div className="sm:col-span-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Slug (ID)</label>
                    <div className="mt-2">
                        <input {...register("slug", { required: true })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Play Store URL</label>
                    <div className="mt-2">
                        <input {...register("playStoreUrl", { required: true })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                    </div>
                </div>

                <div className="sm:col-span-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Status</label>
                    <div className="mt-2">
                        <select {...register("status")} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3">
                            <option value="live">Live</option>
                            <option value="closed_test">Closed Test</option>
                            <option value="development">Development</option>
                        </select>
                    </div>
                </div>

                <div className="sm:col-span-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Order</label>
                    <div className="mt-2">
                        <input type="number" {...register("order")} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Description (EN)</label>
                    <div className="mt-2">
                        <textarea {...register("description.en")} rows={3} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">Description (TR)</label>
                    <div className="mt-2">
                        <textarea {...register("description.tr")} rows={3} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save App"}
                </button>
            </div>
        </form>
    );
}
