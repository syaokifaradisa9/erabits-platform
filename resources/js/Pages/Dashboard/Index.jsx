import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import { CheckCircle, AlertCircle, Wrench, Clock, TrendingUp } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function DashboardIndex({ stats, recent_orders, problematic_assets, user }) {
    // Helper function to get status badge color
    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'Terkonfirmasi':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Dikerjakan':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
            case 'Selesai':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'Ditolak':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <RootLayout title="Dashboard Client">
            <div className="p-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Selamat Datang, {user?.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400">Berikut ringkasan aset dan order Anda</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Assets Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Total Aset</p>
                                <p className="text-3xl font-bold">{stats?.total_assets || 0}</p>
                            </div>
                            <div className="p-3 bg-blue-400/30 rounded-full">
                                <Wrench className="h-8 w-8" />
                            </div>
                        </div>
                    </div>

                    {/* Active Orders Card */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Order Aktif</p>
                                <p className="text-3xl font-bold">{stats?.active_orders || 0}</p>
                            </div>
                            <div className="p-3 bg-purple-400/30 rounded-full">
                                <TrendingUp className="h-8 w-8" />
                            </div>
                        </div>
                    </div>

                    {/* Assets in Maintenance Card */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Dalam Pemeliharaan</p>
                                <p className="text-3xl font-bold">{stats?.assets_in_maintenance || 0}</p>
                            </div>
                            <div className="p-3 bg-orange-400/30 rounded-full">
                                <Clock className="h-8 w-8" />
                            </div>
                        </div>
                    </div>

                    {/* Completed This Month Card */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Selesai Bulan Ini</p>
                                <p className="text-3xl font-bold">{stats?.completed_orders_this_month || 0}</p>
                            </div>
                            <div className="p-3 bg-green-400/30 rounded-full">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders and Problematic Assets */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Orders */}
                    <ContentCard title="Order Terbaru">
                        <div className="space-y-4">
                            {recent_orders && recent_orders.length > 0 ? (
                                recent_orders.map((order) => (
                                    <Link
                                        href={`/orders/${order.id}/detail`}
                                        key={order.id}
                                        className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Order #{order.number}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.total_items} item | {order.created_at}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">Belum ada order</p>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <Link 
                                href="/orders" 
                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                                Lihat Semua Order →
                            </Link>
                        </div>
                    </ContentCard>

                    {/* Problematic Assets */}
                    <ContentCard title="Aset Bermasalah">
                        <div className="space-y-4">
                            {problematic_assets && problematic_assets.length > 0 ? (
                                problematic_assets.map((asset) => (
                                    <Link
                                        href={`/my-assets/${asset.id}`}
                                        key={asset.id}
                                        className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{asset.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                SN: {asset.identify_number || '-'} | {asset.location}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">Tidak ada aset bermasalah</p>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <Link 
                                href="/my-assets" 
                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                                Lihat Semua Aset →
                            </Link>
                        </div>
                    </ContentCard>
                </div>
            </div>
        </RootLayout>
    );
}
