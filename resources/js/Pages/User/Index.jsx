import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import Button from "@/Components/Buttons/Button";
import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import DataTable from "@/Components/Tables/Datatable";
import { Link, router } from "@inertiajs/react";
import FormSearch from "@/Components/Forms/FormSearch";
import ConfirmationModal from "@/Components/Modals/ConfirmationModal";

export default function UserIndex() {
    const [dataTable, setDataTable] = useState([]);
    const [params, setParams] = useState({
        search: "",
        limit: 20,
        page: 1,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    async function loadDatatable() {
        let url = `/users/datatable`;
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

    function onDelete(user) {
        setUserToDelete(user);
        setIsModalOpen(true);
    }

    function handleConfirmDelete() {
        if (userToDelete) {
            router.delete(`/users/${userToDelete.id}/delete`, {
                onSuccess: () => {
                    loadDatatable();
                    setIsModalOpen(false);
                    setUserToDelete(null);
                },
                preserveScroll: true,
            });
        }
    }

    const columns = [
        {
            header: "Layanan",
            render: (user) => user?.service_item_type?.name ?? "-",
            roles: ["Superadmin", "Admin"],
            footer: (
                <FormSearch
                    name="service_item_type"
                    onChange={onParamsChange}
                    placeholder="Filter Layanan"
                />
            ),
        },
        {
            header: "Nama",
            render: (user) => user.name,
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
            render: (user) => user.email,
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
            render: (user) => user.phone ?? "-",
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
            render: (user) => user.province ?? "-",
            footer: (
                <FormSearch
                    name="phone"
                    onChange={onParamsChange}
                    placeholder="Filter Provinsi"
                />
            ),
        },
        {
            header: "Kota",
            render: (user) => user.city ?? "-",
            footer: (
                <FormSearch
                    name="city"
                    onChange={onParamsChange}
                    placeholder="Filter Kota"
                />
            ),
        },
        {
            header: "Role",
            render: (user) => user.roles.map((role) => role.name).join(", "),
            footer: (
                <FormSearch
                    name="roles"
                    onChange={onParamsChange}
                    placeholder="Filter Role"
                />
            ),
        },
        {
            header: "Aksi",
            render: (user) => (
                <div className="flex items-center">
                    <Link
                        href={`/users/${user.id}/edit`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        <Edit className="size-4" />
                    </Link>
                    <button
                        type="button"
                        onClick={() => onDelete(user)}
                        className="ml-2 text-red-600 dark:text-red-400 hover:underline"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <RootLayout title="Manajemen Pengguna">
            <ContentCard
                title="Data Pengguna"
                additionalButton={
                    <Button
                        label="Tambah Pengguna"
                        href="/users/create"
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
                Apakah Anda yakin ingin menghapus pengguna{" "}
                <strong>{userToDelete?.name}</strong>?
            </ConfirmationModal>
        </RootLayout>
    );
}
