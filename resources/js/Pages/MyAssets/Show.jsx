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
                        {/* Tampilkan lokasi dari maintenance terbaru */}
                        {inventory.maintenances && inventory.maintenances.length > 0 && (
                            (() => {
                                // Ambil maintenance terbaru berdasarkan finish_date atau created_at
                                const latestMaintenance = inventory.maintenances.reduce((latest, current) => {
                                    const currentFinishDate = new Date(current.item_order_maintenance?.finish_date || current.item_order_maintenance?.created_at || '1970-01-01');
                                    const latestFinishDate = new Date(latest.item_order_maintenance?.finish_date || latest.item_order_maintenance?.created_at || '1970-01-01');
                                    return currentFinishDate > latestFinishDate ? current : latest;
                                }, inventory.maintenances[0]);
                                
                                if (latestMaintenance?.location) {
                                    return (
                                        <div>
                                            <h3 className="font-semibold text-gray-500">Lokasi Pemeliharaan Terakhir</h3>
                                            <p className="text-gray-900 dark:text-white">{latestMaintenance.location}</p>
                                        </div>
                                    );
                                }
                                return (
                                    <div>
                                        <h3 className="font-semibold text-gray-500">Lokasi Pemeliharaan Terakhir</h3>
                                        <p className="text-gray-900 dark:text-white">-</p>
                                    </div>
                                );
                            })()
                        )}
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
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className={`text-lg font-semibold ${needsRepair ? 'text-red-600' : hasBrokenItems ? 'text-orange-600' : 'text-green-600'}`}>
                                                    Status: {needsRepair ? 'Perlu Perbaikan' : hasBrokenItems ? 'Ditemukan Kerusakan' : 'Kondisi Baik'}
                                                </h4>
                                            </div>
                                            
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
                                                <div className="space-y-3">
                                                    {maintenanceChecklists.map(checklist => (
                                                        <div key={checklist.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                            <div className="flex items-start">
                                                                <div className="mr-3 mt-1">{getConditionIcon([checklist])}</div>
                                                                <div className="flex-1">
                                                                    <div className="flex justify-between items-start">
                                                                        <p className="font-medium text-gray-800 dark:text-gray-200">{checklist.name}</p>
                                                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                                                            checklist.condition === 'Rusak' ? 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300' : 
                                                                            checklist.condition === 'Baik' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' : 
                                                                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                                        }`}>
                                                                            {checklist.condition}
                                                                        </span>
                                                                    </div>
                                                                    {checklist.condition === 'Rusak' && checklist.fix_action && (
                                                                        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                                                                            <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Perbaikan di Lakukan:</p>
                                                                            <p className="text-sm text-red-600 dark:text-red-400">{checklist.fix_action}</p>
                                                                        </div>
                                                                    )}
                                                                    {checklist.repair_status && (
                                                                        <div className="mt-3 p-3 rounded-md border ${
                                                                            checklist.repair_status === 'pending' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 
                                                                            checklist.repair_status === 'in_progress' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 
                                                                            checklist.repair_status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 
                                                                            checklist.repair_status === 'declined' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 
                                                                            'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                                                        }">
                                                                            <div className="flex justify-between items-center">
                                                                                <p className="font-medium ${
                                                                                    checklist.repair_status === 'completed' ? 'text-green-600 dark:text-green-400' : 
                                                                                    checklist.repair_status === 'in_progress' ? 'text-yellow-600 dark:text-yellow-400' : 
                                                                                    checklist.repair_status === 'pending' ? 'text-blue-600 dark:text-blue-400' : 
                                                                                    checklist.repair_status === 'declined' ? 'text-red-600 dark:text-red-400' : 
                                                                                    'text-gray-600 dark:text-gray-400'
                                                                                }">
                                                                                    Status: {checklist.repair_status === 'pending' ? 'Menunggu Persetujuan' : 
                                                                                      checklist.repair_status === 'in_progress' ? 'Dalam Perbaikan' : 
                                                                                      checklist.repair_status === 'completed' ? 'Selesai' : 
                                                                                      checklist.repair_status === 'declined' ? 'Ditolak' : checklist.repair_status}
                                                                                </p>
                                                                                {checklist.repair_cost_estimate && (
                                                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                                        Rp{Number(checklist.repair_cost_estimate).toLocaleString('id-ID')}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            {checklist.repair_notes && (
                                                                                <div className="mt-2 text-sm">
                                                                                    <p className="text-gray-600 dark:text-gray-400">Catatan: {checklist.repair_notes}</p>
                                                                                </div>
                                                                            )}
                                                                            {checklist.repair_status === 'pending' && (
                                                                                <div className="mt-3 flex space-x-2">
                                                                                    <button
                                                                                        onClick={() => handleApprove(checklist.id)}
                                                                                        className="flex-1 px-3 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
                                                                                    >
                                                                                        Setuju
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => handleDecline(checklist.id)}
                                                                                        className="flex-1 px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
                                                                                    >
                                                                                        Tolak
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    {/* History Perbaikan */}
                                                                    {checklist.repair_histories && checklist.repair_histories.length > 0 && (
                                                                        <div className="mt-3">
                                                                            <details className="group">
                                                                                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center hover:text-blue-600 dark:hover:text-blue-400">
                                                                                    <svg className="mr-2 h-4 w-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                                    </svg>
                                                                                    <span>Riwayat Perbaikan ({checklist.repair_histories.length})</span>
                                                                                </summary>
                                                                                <div className="mt-2 space-y-2">
                                                                                    {checklist.repair_histories.map((history) => (
                                                                                        <div key={history.id} className="text-xs bg-gray-50 dark:bg-gray-800/50 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                                                            <div className="flex justify-between">
                                                                                                <span className="font-medium">Status:</span>
                                                                                                <span>{history.updated_at}</span>
                                                                                            </div>
                                                                                            <div className="truncate">
                                                                                                {history.old_status ? `'${history.old_status}' → '${history.new_status}'` : `'${history.new_status}'`}
                                                                                            </div>
                                                                                            {history.activity_type && (
                                                                                                <div className="text-gray-500 dark:text-gray-400">
                                                                                                    Jenis: {
                                                                                                        history.activity_type === 'repair_status_change' ? 'Perubahan Status' :
                                                                                                        history.activity_type === 'condition_change' ? 'Perubahan Kondisi' :
                                                                                                        history.activity_type === 'client_approval' ? 'Persetujuan Klien' :
                                                                                                        history.activity_type === 'client_decline' ? 'Penolakan Klien' :
                                                                                                        history.activity_type === 'fix_action_change' ? 'Perubahan Aksi' : 'Aktivitas'
                                                                                                    }
                                                                                                </div>
                                                                                            )}
                                                                                            {history.notes && (
                                                                                                <div className="truncate">
                                                                                                    {history.notes}
                                                                                                </div>
                                                                                            )}
                                                                                            <div className="text-gray-400 dark:text-gray-500">
                                                                                                Oleh: {history.updated_by}
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </details>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
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
