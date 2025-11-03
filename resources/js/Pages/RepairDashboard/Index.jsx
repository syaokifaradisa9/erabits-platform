import React from 'react';
import { Head } from '@inertiajs/react';
import RootLayout from '@/Layouts/RootLayout';
import ContentCard from '@/Components/Layouts/ContentCard';

const RepairDashboard = ({ checklists }) => {
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'declined':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending':
                return 'Menunggu Persetujuan';
            case 'in_progress':
                return 'Dalam Perbaikan';
            case 'completed':
                return 'Selesai';
            case 'declined':
                return 'Ditolak';
            default:
                return status || 'Belum Ditentukan';
        }
    };

    return (
        <RootLayout title="Dashboard Perbaikan">
            <Head title="Dashboard Perbaikan" />
            
            <ContentCard title="Daftar Item Perlu Perbaikan">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Item
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Klien
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Deskripsi
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi Perbaikan
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status Perbaikan
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estimasi Biaya
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Lokasi
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {checklists && checklists.length > 0 ? (
                                checklists.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                                                <div className="text-sm text-gray-500">{item.item_merk} {item.item_model}</div>
                                                <div className="text-xs text-gray-400">No. Order: {item.order_number}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.client_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {item.description}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {item.fix_action || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.repair_status)}`}>
                                                {getStatusLabel(item.repair_status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.repair_cost_estimate ? `Rp${Number(item.repair_cost_estimate).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.location || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.maintenance_date}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                        Tidak ada item yang perlu diperbaiki saat ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </ContentCard>
        </RootLayout>
    );
};

export default RepairDashboard;