import AppForm from "@/components/admin/AppForm";

// Disable static prerendering - this page uses Firebase client SDK
export const dynamic = 'force-dynamic';

export default function NewAppPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Create New App</h1>
            <AppForm />
        </div>
    );
}
