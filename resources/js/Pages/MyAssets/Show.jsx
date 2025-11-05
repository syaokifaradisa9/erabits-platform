import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import { CheckCircle, XCircle, Wrench, Filter } from "lucide-react";
import { Link } from "@inertiajs/react";

import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { usePage } from "@inertiajs/react";

export default function Show({ inventory, filter }) {
    const { csrf_token } = usePage().props;

    const getConditionIcon = (checklists) => {
        const hasBroken = checklists.some(c => c.condition === 'Rusak');
        if (hasBroken) {
            return <XCircle className="text-red-500" />;
        }
        return <CheckCircle className="text-green-500" />;
    };

    const handleApprove = (checklistId) => {
        toast(
            (t) => (
                <div className="p-3">
                    <p className="font-semibold text-gray-800">Konfirmasi Persetujuan</p>
                    <p className="text-sm text-gray-600 mt-1">Apakah Anda yakin ingin menyetujui perbaikan ini?</p>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={async () => {
                                try {
                                    const response = await fetch(`/my-assets/${inventory.id}/update-repair-status`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'X-Requested-With': 'XMLHttpRequest',
                                            'X-CSRF-TOKEN': csrf_token,
                                        },
                                        body: JSON.stringify({
                                            checklist_id: checklistId,
                                            action: 'approve'
                                        })
                                    });
                                    
                                    const data = await response.json();
                                    
                                    if (response.ok) {
                                        toast.success(data.message || 'Perbaikan disetujui dan sedang dalam proses.');
                                        // Refresh halaman untuk memperbarui status
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 1000);
                                    } else {
                                        toast.error('Gagal menyetujui perbaikan: ' + (data.message || 'Error tidak diketahui'));
                                    }
                                } catch (error) {
                                    toast.error('Gagal menyetujui perbaikan: ' + error.message);
                                }
                                toast.dismiss(t.id);
                            }}
                            className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                        >
                            Ya, Setuju
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            ),
            {
                duration: Infinity,
            }
        );
    };

    const handleDecline = (checklistId) => {
        toast(
            (t) => (
                <div className="p-3">
                    <p className="font-semibold text-gray-800">Konfirmasi Penolakan</p>
                    <p className="text-sm text-gray-600 mt-1">Apakah Anda yakin ingin menolak perbaikan ini?</p>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={async () => {
                                try {
                                    const response = await fetch(`/my-assets/${inventory.id}/update-repair-status`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'X-Requested-With': 'XMLHttpRequest',
                                            'X-CSRF-TOKEN': csrf_token,
                                        },
                                        body: JSON.stringify({
                                            checklist_id: checklistId,
                                            action: 'decline'
                                        })
                                    });
                                    
                                    const data = await response.json();
                                    
                                    if (response.ok) {
                                        toast.error(data.message || 'Perbaikan ditolak.');
                                        // Refresh halaman untuk memperbarui status
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 1000);
                                    } else {
                                        toast.error('Gagal menolak perbaikan: ' + (data.message || 'Error tidak diketahui'));
                                    }
                                } catch (error) {
                                    toast.error('Gagal menolak perbaikan: ' + error.message);
                                }
                                toast.dismiss(t.id);
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                        >
                            Ya, Tolak
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            ),
            {
                duration: Infinity,
            }
        );
    };

    const getFilterLabel = (filterValue) => {
        switch (filterValue) {
            case 'needs_repair': return 'Perlu Perbaikan';
            case 'broken_only': return 'Hanya Rusak';
            case 'in_repair': return 'Dalam Perbaikan';
            case 'completed': return 'Selesai';
            default: return 'Semua Riwayat';
        }
    };

    return (
        <RootLayout title={`Riwayat Aset - ${inventory.name}`}>
            <ContentCard title={`Detail Aset: ${inventory.name}`} backPath="/my-assets">
                {/* Asset Details */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-500">Nama Aset</h3>
                            <p className="text-gray-900 dark:text-white">{inventory.name}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-500">Tipe Layanan</h3>
                            <p className="text-gray-900 dark:text-white">{inventory.service_item_type.name}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-500">Lokasi</h3>
                            <p className="text-gray-900 dark:text-white">{inventory.location}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-500">Nomor Seri</h3>
                            <p className="text-gray-900 dark:text-white">{inventory.identify_number ?? '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Filter Options */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center mb-2">
                        <Filter className="h-5 w-5 mr-2 text-gray-500" />
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Filter Riwayat</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link 
                            href={`/my-assets/${inventory.id}`}
                            className={`px-3 py-1 rounded-md text-sm ${!filter ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}
                        >
                            Semua Riwayat
                        </Link>
                        <Link 
                            href={`/my-assets/${inventory.id}?filter=broken_only`}
                            className={`px-3 py-1 rounded-md text-sm ${filter === 'broken_only' ? 'bg-red-500 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}
                        >
                            Hanya Rusak
                        </Link>
                        <Link 
                            href={`/my-assets/${inventory.id}?filter=needs_repair`}
                            className={`px-3 py-1 rounded-md text-sm ${filter === 'needs_repair' ? 'bg-yellow-500 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}
                        >
                            Perlu Perbaikan
                        </Link>
                        <Link 
                            href={`/my-assets/${inventory.id}?filter=in_repair`}
                            className={`px-3 py-1 rounded-md text-sm ${filter === 'in_repair' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}
                        >
                            Dalam Perbaikan
                        </Link>
                        <Link 
                            href={`/my-assets/${inventory.id}?filter=completed`}
                            className={`px-3 py-1 rounded-md text-sm ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200'}`}
                        >
                            Selesai
                        </Link>
                    </div>
                    {filter && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Sedang menampilkan: {getFilterLabel(filter)}
                        </p>
                    )}
                </div>

                {/* Maintenance History Timeline */}
                <div>
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                        Riwayat Pemeliharaan {filter ? `(${getFilterLabel(filter)})` : ''}
                    </h3>
                    <div className="space-y-8 border-l-2 border-gray-200 dark:border-gray-700 ml-3">
                        {inventory.maintenances.length > 0 ? (
                            inventory.maintenances.map(maintenance => {
                                const maintenanceChecklists = maintenance.item_order_maintenance.checklists;
                                const hasBrokenItems = maintenanceChecklists.some(c => c.condition === 'Rusak');
                                const needsRepair = maintenanceChecklists.some(c => 
                                    c.condition === 'Rusak' || ['pending', 'in_progress'].includes(c.repair_status)
                                );

                                return (
                                    <div key={maintenance.id} className="relative">
                                        <div className="absolute -left-[1.4rem] bg-white dark:bg-gray-800 flex items-center justify-center">
                                            <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center ring-8 ring-white dark:ring-gray-900">
                                                <Wrench size={20} />
                                            </div>
                                        </div>
                                        <div className="ml-12 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                                            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                                {new Date(maintenance.item_order_maintenance.finish_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </time>
                                            <h4 className={`text-lg font-semibold ${needsRepair ? 'text-red-600' : hasBrokenItems ? 'text-orange-600' : 'text-green-600'}`}>
                                                Status: {needsRepair ? 'Perlu Perbaikan' : hasBrokenItems ? 'Ditemukan Kerusakan' : 'Kondisi Baik'}
                                            </h4>
                                            
                                            {/* Bukti pemeliharaan jika tersedia */}
                                            {maintenance.item_order_maintenance.image_path && (
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bukti Pemeliharaan:</p>
                                                    <img 
                                                        src={`/storage/${maintenance.item_order_maintenance.image_path}`} 
                                                        alt="Foto bukti pemeliharaan" 
                                                        className="w-64 h-64 object-contain border border-gray-200 rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            
                                            {/* Foto alat jika tersedia */}
                                            {maintenance.item_order_maintenance.asset_image_path && (
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Foto Alat:</p>
                                                    <img 
                                                        src={`/storage/${maintenance.item_order_maintenance.asset_image_path}`} 
                                                        alt="Foto alat" 
                                                        className="w-64 h-64 object-contain border border-gray-200 rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            <div className="mt-4">
                                                <h5 className="font-semibold mb-2">Detail Checklist:</h5>
                                                <ul className="space-y-2">
                                                    {maintenanceChecklists.map(checklist => (
                                                        <li key={checklist.id} className="flex items-start p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                                                            <div className="mr-2 mt-1">{getConditionIcon([checklist])}</div>
                                                            <div>
                                                                <p className="font-medium text-gray-800 dark:text-gray-200">{checklist.name}</p>
                                                                {checklist.condition === 'Rusak' && (
                                                                    <p className="text-sm text-red-500">
                                                                        <span className="font-semibold">Saran Perbaikan:</span> {checklist.fix_action || 'Tidak ada saran.'}
                                                                    </p>
                                                                )}
                                                                {checklist.repair_status && (
                                                                    <div className="mt-1 text-sm">
                                                                        <p className={`font-semibold ${checklist.repair_status === 'completed' ? 'text-green-600' : checklist.repair_status === 'in_progress' ? 'text-yellow-600' : checklist.repair_status === 'pending' ? 'text-blue-600' : 'text-red-600'}`}>
                                                                            Status Perbaikan: {checklist.repair_status === 'pending' ? 'Menunggu Persetujuan' : 
                                                                              checklist.repair_status === 'in_progress' ? 'Dalam Perbaikan' : 
                                                                              checklist.repair_status === 'completed' ? 'Selesai' : 
                                                                              checklist.repair_status === 'declined' ? 'Ditolak' : checklist.repair_status}
                                                                        </p>
                                                                        {checklist.repair_cost_estimate && (
                                                                            <p className="text-gray-600">Estimasi Biaya: Rp{Number(checklist.repair_cost_estimate).toLocaleString('id-ID')}</p>
                                                                        )}
                                                                        {checklist.repair_notes && (
                                                                            <p className="text-gray-600">Catatan: {checklist.repair_notes}</p>
                                                                        )}
                                                                        {checklist.repair_status === 'pending' && (
                                                                            <div className="mt-2 flex space-x-2">
                                                                                <button
                                                                                    onClick={() => handleApprove(checklist.id)}
                                                                                    className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                                                                                >
                                                                                    Setuju
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDecline(checklist.id)}
                                                                                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                                                                                >
                                                                                    Tolak
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                        {/* History Perbaikan */}
                                                                        {checklist.repair_histories && checklist.repair_histories.length > 0 && (
                                                                            <div className="mt-3 border-t border-gray-200 pt-2">
                                                                                <details className="group">
                                                                                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center">
                                                                                        <span>Riwayat Perubahan Status</span>
                                                                                        <svg className="ml-2 h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                                        </svg>
                                                                                    </summary>
                                                                                    <div className="mt-2 space-y-2">
                                                                                        {checklist.repair_histories.map((history) => (
                                                                                            <div key={history.id} className="text-xs bg-gray-50 p-2 rounded">
                                                                                                <p>
                                                                                                    <span className="font-medium">Status:</span> 
                                                                                                    {history.old_status ? `'${history.old_status}' → '${history.new_status}'` : `'${history.new_status}'`}
                                                                                                </p>
                                                                                                <p>
                                                                                                    <span className="font-medium">Oleh:</span> {history.updated_by}
                                                                                                </p>
                                                                                                <p>
                                                                                                    <span className="font-medium">Tanggal:</span> {history.updated_at}
                                                                                                </p>
                                                                                                {history.notes && (
                                                                                                    <p>
                                                                                                        <span className="font-medium">Catatan:</span> {history.notes}
                                                                                                    </p>
                                                                                                )}
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </details>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="ml-12">
                                <p className="text-gray-500">Tidak ada riwayat pemeliharaan dengan filter yang dipilih.</p>
                            </div>
                        )}
                    </div>
                </div>
            </ContentCard>
        </RootLayout>
    );
}
