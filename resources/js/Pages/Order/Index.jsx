import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import Button from "@/Components/Buttons/Button";
import { useEffect, useState } from "react";
import { Check, Edit, Eye, Info, Plus, Trash2 } from "lucide-react";
import DataTable from "@/Components/Tables/Datatable";
import { Link, router } from "@inertiajs/react";
import FormSearch from "@/Components/Forms/FormSearch";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";

export default function OrderIndex() {
    const [dataTable, setDataTable] = useState([]);
    const [params, setParams] = useState({
        search: "",
        limit: 20,
        page: 1,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [orderToConfirm, setOrderToConfirm] = useState(null);

    async function loadDatatable() {
        let url = `/orders/datatable`;
        let paramsKey = Object.keys(params);
        for (let i = 0; i < paramsKey.length; i++) {
            url += i === 0 ? `?` : `&`;
            url += `${paramsKey[i]}=${params[paramsKey[i]]}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setDataTable(data);
    }

    useEffect(() => {
        loadDatatable();
    }, [params]);

    function onChangePage(e) {
        e.preventDefault();
        const url = new URL(e.target.href);
        setParams({ ...params, page: url.searchParams.get("page") });
    }

    function onParamsChange(e) {
        setParams({ ...params, page: 1, [e.target.name]: e.target.value });
    }

    function onDelete(order) {
        setOrderToDelete(order);
        setIsModalOpen(true);
    }

    function handleConfirmDelete() {
        if (orderToDelete) {
            router.delete(`/orders/${orderToDelete.id}/delete`, {
                onSuccess: () => {
                    loadDatatable();
                    setIsModalOpen(false);
                    setOrderToDelete(null);
                },
                preserveScroll: true,
            });
        }
    }

    function onConfirm(order) {
        setOrderToConfirm(order);
        setIsConfirmModalOpen(true);
    }

    function handleConfirmOrder() {
        if (orderToConfirm) {
            router.put(
                `/orders/${orderToConfirm.id}/confirm`,
                {},
                {
                    onSuccess: () => {
                        loadDatatable();
                        setIsConfirmModalOpen(false);
                        setOrderToConfirm(null);
                    },
                    preserveScroll: true,
                }
            );
        }
    }

    function formatIndonesianDate(dateString) {
        const date = new Date(dateString);
        const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        return new Intl.DateTimeFormat("id-ID", options).format(date);
    }

    const columns = [
        {
            header: "Nomor Order",
            render: (order) => order.number ?? "-",
            footer: (
                <FormSearch
                    name="number"
                    onChange={onParamsChange}
                    placeholder="Filter Nomor Order"
                />
            ),
        },
        {
            header: "Klien",
            render: (order) => order.client.name,
            footer: (
                <FormSearch
                    name="client"
                    onChange={onParamsChange}
                    placeholder="Filter Klien"
                />
            ),
        },
        {
            header: "Jumlah Permintaan",
            render: (order) => order.item_count,
        },
        {
            header: "Status",
            render: (order) => order.status,
            footer: (
                <FormSearch
                    name="status"
                    onChange={onParamsChange}
                    placeholder="Filter Status"
                />
            ),
        },
        {
            header: "Tanggal Permintaan",
            render: (order) => formatIndonesianDate(order.created_at),
            footer: (
                <FormSearch
                    type="month"
                    name="created_at"
                    onChange={onParamsChange}
                    placeholder="Filter Tanggal Permintaan"
                />
            ),
        },
        {
            header: "Aksi",
            render: (order) => (
                <div className="flex items-center">
                    {order.status == "Pending" && (
                        <button
                            type="button"
                            onClick={() => onConfirm(order)}
                            className="text-green-600 dark:text-green-400 hover:underline"
                        >
                            <Check className="size-4" />
                        </button>
                    )}
                    {order.status == "Pending" && (
                        <Link
                            href={`/orders/${order.id}/edit`}
                            className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            <Edit className="size-4" />
                        </Link>
                    )}
                    {order.status == "Pending" && (
                        <button
                            type="button"
                            onClick={() => onDelete(order)}
                            className="ml-2 text-red-600 dark:text-red-400 hover:underline"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    )}
                    <Link
                        href={`/orders/${order.id}/detail`}
                        className="ml-2 text-gray-600 dark:text-gray-400 hover:underline"
                    >
                        <Info className="size-4" />
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <RootLayout title="Manajemen Order">
            <ContentCard
                title="Data Order"
                additionalButton={
                    <Button
                        label="Tambah Order"
                        href="/orders/create"
                        icon={<Plus className="size-4" />}
                    />
                }
            >
                <DataTable
                    onChangePage={onChangePage}
                    onParamsChange={onParamsChange}
                    limit={params.limit}
                    dataTable={dataTable}
                    columns={columns}
                />
            </ContentCard>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Konfirmasi Hapus"
                confirmVariant="danger"
                confirmText="Hapus"
            >
                Apakah Anda yakin ingin menghapus order{" "}
                <strong>{orderToDelete?.order_number}</strong>?
            </ConfirmationModal>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmOrder}
                title="Konfirmasi Order"
                confirmVariant="primary"
                confirmText="Konfirmasi"
            >
                Apakah Anda yakin ingin mengonfirmasi order{" "}
                <strong>{orderToConfirm?.order_number}</strong>?
            </ConfirmationModal>
        </RootLayout>
    );
}
