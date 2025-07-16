import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import Button from "@/Components/Buttons/Button";
import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import DataTable from "@/Components/Tables/Datatable";
import FormSearch from "@/Components/Forms/FormSearch";
import { Link, router } from "@inertiajs/react";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";

export default function ClientIndex() {
    const [dataTable, setDataTable] = useState([]);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [params, setParams] = useState({
        search: "",
        limit: 20,
        page: 1,
    });

    async function loadDatatable() {
        let url = `/clients/datatable`;
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

    const columns = [
        {
            header: "Nama",
            render: (client) => client.name,
            footer: (
                <FormSearch
                    name="name"
                    onChange={onParamsChange}
                    placeholder="Filter Nama"
                />
            ),
        },
        {
            header: "Email",
            render: (client) => client.email,
            footer: (
                <FormSearch
                    name="email"
                    onChange={onParamsChange}
                    placeholder="Filter Email"
                />
            ),
        },
        {
            header: "Telepon",
            render: (client) => client.phone,
            footer: (
                <FormSearch
                    name="phone"
                    onChange={onParamsChange}
                    placeholder="Filter Telepon"
                />
            ),
        },
        {
            header: "Provinsi",
            render: (client) => client.province,
        },
        {
            header: "Kota",
            render: (client) => client.city,
        },
        {
            header: "Aksi",
            render: (client) => (
                <div className="flex items-center">
                    <Link
                        href={`/clients/${client.id}/edit`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        <Edit className="size-4" />
                    </Link>
                    <button
                        type="button"
                        onClick={() => onDelete(client)}
                        className="ml-2 text-red-600 dark:text-red-400 hover:underline"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            ),
        },
    ];

    function onDelete(user) {
        setUserToDelete(user);
        setIsModalOpen(true);
    }

    function handleConfirmDelete() {
        if (userToDelete) {
            router.delete(`/clients/${userToDelete.id}/delete`, {
                onSuccess: () => {
                    loadDatatable();
                    setIsModalOpen(false);
                    setUserToDelete(null);
                },
                preserveScroll: true,
            });
        }
    }

    return (
        <RootLayout title="Manajemen Klien">
            <ContentCard
                title="Data Klien"
                additionalButton={
                    <Button
                        label="Tambah Klien"
                        href="/clients/create"
                        icon={<Plus className="size-4" />}
                    />
                }
            >
                {dataTable && (
                    <DataTable
                        onChangePage={onChangePage}
                        onParamsChange={onParamsChange}
                        limit={params.limit}
                        dataTable={dataTable}
                        columns={columns}
                    />
                )}
            </ContentCard>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Konfirmasi Hapus"
                confirmVariant="danger"
                confirmText="Hapus"
            >
                Apakah Anda yakin ingin menghapus klien{" "}
                <strong>{userToDelete?.name}</strong>?
            </ConfirmationModal>
        </RootLayout>
    );
}
