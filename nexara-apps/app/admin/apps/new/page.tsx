import AppForm from "@/components/admin/AppForm";
import { Plus } from "lucide-react";

// Disable static prerendering - this page uses Firebase client SDK
export const dynamic = 'force-dynamic';

export default function NewAppPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Create New App</h1>
                    <p className="text-gray-400">Add a new application to your portfolio</p>
                </div>
            </div>
            <AppForm />
        </div>
    );
}

