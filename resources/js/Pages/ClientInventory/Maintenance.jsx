import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import GeneralTable from "@/Components/Tables/GeneralTable";
import { useMemo, useState } from "react";
import FormInput from "@/Components/Forms/FormInput";
import FormSelect from "@/Components/Forms/FormSelect";

export default function Maintenance({ inventory, maintenances }) {
    const [params, setParams] = useState({ search: "", status: "ALL" });

    const filteredMaintenances = useMemo(() => {
        let filteredData = [...maintenances];

        if (params.status) {
            if (params.status === "Selesai") {
                filteredData = filteredData.filter((item) => item.finish_date);
            } else if (params.status === "Belum Selesai") {
                filteredData = filteredData.filter((item) => !item.finish_date);
            }
        }

        if (params.search) {
            const searchTerm = params.search.toLowerCase();
            filteredData = filteredData.filter((item) => {
                const serviceType =
                    item.item_order.item.service_item_type.name.toLowerCase();
                const itemName = item.item_order.name.toLowerCase();
                const merk = item.item_order.merk
                    ? item.item_order.merk.toLowerCase()
                    : "";
                const model = item.item_order.model
                    ? item.item_order.model.toLowerCase()
                    : "";
                const sn = item.item_order.identify_number
                    ? item.item_order.identify_number.toLowerCase()
                    : "";
                const estimationDate = formatIndonesianDate(
                    item.estimation_date
                ).toLowerCase();
                const finishDate = formatIndonesianDate(
                    item.finish_date
                ).toLowerCase();

                return (
                    serviceType.includes(searchTerm) ||
                    itemName.includes(searchTerm) ||
                    merk.includes(searchTerm) ||
                    model.includes(searchTerm) ||
                    sn.includes(searchTerm) ||
                    estimationDate.includes(searchTerm) ||
                    finishDate.includes(searchTerm)
                );
            });
        }

        return filteredData;
    }, [maintenances, params]);

    function formatIndonesianDate(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        return new Intl.DateTimeFormat("id-ID", options).format(date);
    }

    function handleFilterChange(e) {
        setParams((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const headers = [
        { label: "No" },
        { label: "Layanan" },
        { label: "Item" },
        { label: "Merek, Model, SN" },
        { label: "Estimasi Jadwal" },
        { label: "Tanggal Pengerjaan" },
    ];

    const columns = [
        {
            render: (item, index) => index + 1,
        },
        {
            render: (item) => item.item_order.item.service_item_type.name,
        },
        {
            render: (item) => item.item_order.name,
        },
        {
            render: (item) =>
                `Merk : ${item.item_order.merk ?? "-"}, Model : ${
                    item.item_order.model ?? "-"
                }, SN : ${item.item_order.identify_number ?? "-"}`,
        },
        {
            render: (item) => formatIndonesianDate(item.estimation_date),
        },
        {
            render: (item) => formatIndonesianDate(item.finish_date),
        },
    ];

    return (
        <RootLayout title={`Riwayat Maintenance - ${inventory.item.name}`}>
            <ContentCard
                title="Riwayat Maintenance"
                backPath="/client-inventories"
            >
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                    <div>
                        <FormSelect
                            label="Filter Status"
                            name="status"
                            value={params.status}
                            onChange={handleFilterChange}
                            options={[
                                { value: "ALL", label: "Semua" },
                                { value: "Selesai", label: "Selesai" },
                                {
                                    value: "Belum Selesai",
                                    label: "Belum Selesai",
                                },
                            ]}
                        />
                    </div>
                    <div>
                        <FormInput
                            label="Cari"
                            name="search"
                            value={params.search}
                            onChange={handleFilterChange}
                            placeholder="Cari Maintenance"
                        />
                    </div>
                </div>
                <GeneralTable
                    headers={headers}
                    items={filteredMaintenances}
                    columns={columns}
                />
            </ContentCard>
        </RootLayout>
    );
}
