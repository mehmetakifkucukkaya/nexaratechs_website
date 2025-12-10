import Link from "next/link";

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <Link href="/admin/apps/new" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
                    + New App
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Apps</h3>
                    </div>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Live on store</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Tester Applications</h3>
                    </div>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">+0 since last week</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Apps */}
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Apps</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <p className="text-muted-foreground text-sm">No apps found.</p>
                    </div>
                </div>

                {/* Recent Testers */}
                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Testers</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <p className="text-muted-foreground text-sm">No applications yet.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
