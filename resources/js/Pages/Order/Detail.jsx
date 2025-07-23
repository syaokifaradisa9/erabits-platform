import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import { Link } from "@inertiajs/react";
import { ChevronLeft, Trash2 } from "lucide-react";

export default function Detail({ order }) {
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const serviceTypes = [
        ...new Set(
            order.item_orders.map(
                (itemOrder) => itemOrder.item.service_item_type.name
            )
        ),
    ];

    const getItemsByServiceType = (serviceTypeName) => {
        return order.item_orders.filter(
            (itemOrder) =>
                itemOrder.item.service_item_type.name === serviceTypeName
        );
    };

    return (
        <RootLayout title={`Detail Order ${order.number || ""}`}>
            <ContentCard
                title="Detail Order"
                backUrl="/orders"
                backUrlText="Kembali"
            >
                <div className="mb-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                        Data Order
                    </h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Fasyankes
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {order.client.name}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Alamat Fasyankes
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {order.client.address}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Nomor Order
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {order.number ?? "-"}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Tanggal Permintaan
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {formatDate(order.order_date)}
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Surat Masuk
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {order.letter_number
                                    ? `Tanggal ${formatDate(
                                          order.letter_date
                                      )} Nomor ${order.letter_number}`
                                    : "-"}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div>
                    <h3 className="mb-2 font-semibold text-gray-800 dark:text-white">
                        Permintaan Layanan
                    </h3>
                    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                        {order.item_orders.length} item
                    </p>

                    {serviceTypes.map((serviceType) => (
                        <div key={serviceType} className="mb-6">
                            <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                                {serviceType}
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-slate-700/50">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-medium text-left text-gray-700 md:text-sm dark:text-slate-300">
                                                No
                                            </th>
                                            <th className="px-4 py-3 text-xs font-medium text-left text-gray-700 md:text-sm dark:text-slate-300">
                                                Nama
                                            </th>
                                            <th className="px-4 py-3 text-xs font-medium text-left text-gray-700 md:text-sm dark:text-slate-300">
                                                Merek
                                            </th>
                                            <th className="px-4 py-3 text-xs font-medium text-left text-gray-700 md:text-sm dark:text-slate-300">
                                                Model/Tipe
                                            </th>
                                            <th className="px-4 py-3 text-xs font-medium text-left text-gray-700 md:text-sm dark:text-slate-300">
                                                No Seri
                                            </th>
                                            <th className="px-4 py-3 text-xs font-medium text-right text-gray-700 md:text-sm dark:text-slate-300">
                                                Tarif (Rp.)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                        {getItemsByServiceType(serviceType).map(
                                            (itemOrder, index) => (
                                                <tr
                                                    key={itemOrder.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-slate-700/30"
                                                >
                                                    <td className="px-4 py-3 text-xs text-gray-700 md:text-sm dark:text-slate-300">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-700 md:text-sm dark:text-slate-300">
                                                        {itemOrder.item.name}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-700 md:text-sm dark:text-slate-300">
                                                        {itemOrder.brand ?? "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-700 md:text-sm dark:text-slate-300">
                                                        {itemOrder.model ?? "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-700 md:text-sm dark:text-slate-300">
                                                        {itemOrder.serial_number ??
                                                            "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs font-medium text-right text-gray-900 md:text-sm dark:text-white">
                                                        {formatCurrency(
                                                            itemOrder.price
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </ContentCard>
        </RootLayout>
    );
}
