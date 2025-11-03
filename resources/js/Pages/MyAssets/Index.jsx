import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import { Link } from "@inertiajs/react";

export default function Index({ inventories, needs_repair_count, inventories_with_repair, filter }) {
    return (
        <RootLayout title="Aset Saya">
            <ContentCard title="Daftar Aset Saya">
                {/* Display repair count if there are items that need repair */}
                {needs_repair_count > 0 && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                                    {needs_repair_count} item perlu diperbaiki
                                </h3>
                                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                    Klik pada aset untuk melihat detail kerusakan dan status perbaikan
                                </p>
                            </div>
                            <Link 
                                href="/my-assets?filter=needs_repair"
                                className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                    </div>
                )}

                {/* Display active filter and filter options */}
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            {filter ? (
                                <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                                    Filter: {filter === 'needs_repair' ? 'Aset Dengan Item Perlu Perbaikan' : filter}
                                </h3>
                            ) : (
                                <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                                    Semua Aset
                                </h3>
                            )}
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                                Menampilkan {inventories.length} aset
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link 
                                href="/my-assets"
                                className={`px-3 py-1 rounded-md text-sm ${!filter ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}
                            >
                                Semua
                            </Link>
                            <Link 
                                href="/my-assets?filter=needs_repair"
                                className={`px-3 py-1 rounded-md text-sm ${filter === 'needs_repair' ? 'bg-yellow-500 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}
                            >
                                Perlu Perbaikan
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {inventories.length > 0 ? (
                        inventories.map((inventory) => (
                            <Link
                                key={inventory.id}
                                href={`/my-assets/${inventory.id}`}
                                className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {inventory.name} <span className="text-base font-normal text-gray-500">({inventory.service_item_type.name})</span>
                                </h5>
                                <p className="font-normal text-gray-700 dark:text-gray-400">
                                    Lokasi: {inventory.location}
                                </p>
                                <p className="font-normal text-gray-700 dark:text-gray-400">
                                    No. Seri: {inventory.identify_number ?? '-'}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Terakhir diperbarui: {new Date(inventory.updated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                {filter === 'needs_repair' 
                                    ? 'Tidak ada aset dengan item yang perlu diperbaiki saat ini.' 
                                    : 'Anda belum memiliki aset yang terdaftar.'}
                            </p>
                        </div>
                    )}
                </div>
            </ContentCard>
        </RootLayout>
    );
}
