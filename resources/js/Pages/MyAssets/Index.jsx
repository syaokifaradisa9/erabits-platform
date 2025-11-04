import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import { Link, router } from "@inertiajs/react";
import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";

// Badge untuk status aset
const StatusBadge = ({ status }) => {
    const statusClasses = {
        needs_repair: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        normal: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    const statusText = {
        needs_repair: "Perlu Perbaikan",
        normal: "Normal",
    };

    return (
        <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${statusClasses[status]}`}>
            {statusText[status]}
        </span>
    );
};

// Komponen Filter
const FilterSection = ({ asset_types, filters }) => {
    const [search, setSearch] = useState(filters.search || "");

    const debouncedSearch = useCallback(
        debounce((value) => {
            router.get("/my-assets", { search: value }, { preserveState: true, replace: true });
        }, 300),
        []
    );

    useEffect(() => {
        debouncedSearch(search);
        return () => debouncedSearch.cancel();
    }, [search, debouncedSearch]);

    const handleFilterChange = (key, value) => {
        router.get("/my-assets", { ...filters, [key]: value, page: 1 }, { preserveState: true, replace: true });
    };

    return (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800/50 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div className="md:col-span-1">
                    <label htmlFor="search" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cari Aset</label>
                    <input
                        type="text"
                        id="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Nama, no. seri, lokasi..."
                    />
                </div>

                {/* Filter by Type */}
                <div className="md:col-span-1">
                    <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipe Aset</label>
                    <select
                        id="type"
                        value={filters.type || ""}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    >
                        <option value="">Semua Tipe</option>
                        {asset_types.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>

                {/* Filter by Status */}
                <div className="md:col-span-1">
                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                    <select
                        id="status"
                        value={filters.status || ""}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    >
                        <option value="">Semua Status</option>
                        <option value="needs_repair">Perlu Perbaikan</option>
                        <option value="normal">Normal</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

// Kartu Aset
const AssetCard = ({ inventory }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col">
            <Link href={`/my-assets/${inventory.id}`}>
                <img className="rounded-t-lg object-cover h-48 w-full" src={inventory.image_url} alt={`Gambar ${inventory.name}`} />
            </Link>
            <div className="p-5 flex flex-col flex-grow">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {inventory.name}
                        </h5>
                        <StatusBadge status={inventory.status} />
                    </div>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400 -mt-2 mb-3">
                        {inventory.service_item_type.name}
                    </p>
                    <p className="mb-1 font-normal text-gray-700 dark:text-gray-400 text-sm">
                        <span className="font-semibold">Lokasi:</span> {inventory.location}
                    </p>
                    <p className="mb-1 font-normal text-gray-700 dark:text-gray-400 text-sm">
                        <span className="font-semibold">No. Seri:</span> {inventory.identify_number ?? '-'}
                    </p>
                </div>
                <div className="mt-auto pt-4">
                     <Link 
                        href={`/my-assets/${inventory.id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full justify-center"
                    >
                        Lihat Detail
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default function Index({ inventories, needs_repair_count, asset_types, filters }) {
    return (
        <RootLayout title="Aset Saya">
            <ContentCard title="Daftar Aset Saya">
                {/* Display repair count if there are items that need repair */}
                {needs_repair_count > 0 && !filters.status && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                                    {needs_repair_count} aset perlu perhatian
                                </h3>
                                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                    Gunakan filter status "Perlu Perbaikan" untuk melihatnya.
                                </p>
                            </div>
                            <button
                                onClick={() => router.get("/my-assets", { status: 'needs_repair' }, { preserveState: true, replace: true })}
                                className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
                            >
                                Lihat Aset
                            </button>
                        </div>
                    </div>
                )}

                {/* Filter Section */}
                <FilterSection asset_types={asset_types} filters={filters} />

                {/* Asset Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {inventories.length > 0 ? (
                        inventories.map((inventory) => (
                            <AssetCard key={inventory.id} inventory={inventory} />
                        ))
                    ) : (
                        <div className="text-center py-12 md:col-span-2 xl:col-span-3">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Aset tidak ditemukan</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Coba ubah filter atau kata kunci pencarian Anda.
                            </p>
                        </div>
                    )}
                </div>
            </ContentCard>
        </RootLayout>
    );
}