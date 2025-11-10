import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Search, Filter, Clock, Wrench, CheckCircle, XCircle } from "lucide-react";

export default function ServiceRequestIndex({ serviceRequests, statusOptions, serviceTypeOptions, filters }) {
    const { csrf_token } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
    const [selectedServiceType, setSelectedServiceType] = useState(filters?.service_type || '');
    
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/service-requests', {
            search: searchTerm,
            status: selectedStatus,
            service_type: selectedServiceType
        }, {
            preserveState: true,
            replace: true
        });
    };
    
    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedStatus('');
        setSelectedServiceType('');
        router.get('/service-requests', {}, {
            preserveState: true,
            replace: true
        });
    };
    
    const updateStatus = (id, newStatus) => {
        if (window.confirm(`Apakah Anda yakin ingin mengubah status permintaan ini menjadi ${getStatusLabel(newStatus)}?`)) {
            fetch(`/service-requests/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf_token,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Refresh halaman setelah perubahan status
                    window.location.reload();
                } else {
                    alert('Gagal memperbarui status: ' + (data.message || 'Terjadi kesalahan'));
                }
            })
            .catch(error => {
                alert('Terjadi kesalahan saat mengirim permintaan');
            });
        }
    };
    
    const getStatusLabel = (status) => {
        switch(status) {
            case 'pending': return 'Pending';
            case 'in_progress': return 'Dalam Proses';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };
    
    const getStatusColor = (status) => {
        switch(status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };
    
    const getServiceTypeLabel = (type) => {
        switch(type) {
            case 'perbaikan': return 'Perbaikan Alat';
            case 'konsultasi': return 'Konsultasi Teknis';
            case 'instalasi': return 'Instalasi Baru';
            default: return type;
        }
    };

    return (
        <RootLayout title="Permintaan Layanan">
            <ContentCard title="Daftar Permintaan Layanan">
                {/* Filter Section */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari nama, kontak..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={selectedServiceType}
                                onChange={(e) => setSelectedServiceType(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {serviceTypeOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Filter
                            </button>
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="px-4 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/* Service Requests List */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">Nama</th>
                                <th className="py-3 px-4 text-left">Kontak</th>
                                <th className="py-3 px-4 text-left">Jenis Layanan</th>
                                <th className="py-3 px-4 text-left">Deskripsi</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Tanggal</th>
                                <th className="py-3 px-4 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {serviceRequests.data && serviceRequests.data.length > 0 ? (
                                serviceRequests.data.map(request => (
                                    <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                        <td className="py-3 px-4 font-medium">{request.id}</td>
                                        <td className="py-3 px-4">
                                            <div className="font-medium">{request.name}</div>
                                        </td>
                                        <td className="py-3 px-4">{request.contact}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {getServiceTypeLabel(request.service_type)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 max-w-xs truncate" title={request.description}>
                                            {request.description.substring(0, 50)}{request.description.length > 50 ? '...' : ''}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                                                {getStatusLabel(request.status)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">{new Date(request.created_at).toLocaleDateString('id-ID')}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-wrap gap-2">
                                                <select
                                                    value={request.status}
                                                    onChange={(e) => updateStatus(request.id, e.target.value)}
                                                    className={`px-2 py-1 text-xs rounded border ${getStatusColor(request.status)}`}
                                                >
                                                    {statusOptions.filter(opt => opt.value !== '').map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
                                        Tidak ada permintaan layanan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {serviceRequests.links && serviceRequests.links.length > 3 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            {serviceRequests.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url || '#'}
                                    onClick={(e) => {
                                        if (link.url) {
                                            e.preventDefault();
                                            router.get(link.url, {}, {
                                                preserveState: true,
                                                replace: true
                                            });
                                        }
                                    }}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        link.active
                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    } ${
                                        index === 0 ? 'rounded-l-md' : 
                                        index === serviceRequests.links.length - 1 ? 'rounded-r-md' : ''
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </ContentCard>
        </RootLayout>
    );
}