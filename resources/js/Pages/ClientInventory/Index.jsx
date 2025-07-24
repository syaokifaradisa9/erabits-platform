import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import { Link } from "@inertiajs/react";
import { Info } from "lucide-react";
import { useState, useEffect } from "react";
import Tooltip from "@/Components/Common/Tooltip";
import DataTable from "@/Components/Tables/Datatable";
import FormSearch from "@/Components/Forms/FormSearch";

export default function ClientInventoryIndex() {
    const [params, setParams] = useState({ search: "", limit: 10, page: 1 });
    const [dataTable, setDataTable] = useState([]);

    async function loadDatatable() {
        let url = `/client-inventories/datatable`;
        let paramsKey = Object.keys(params);
        for (let i = 0; i < paramsKey.length; i++) {
            if (i == 0) {
                url += `?${paramsKey[i]}=${params[paramsKey[i]]}`;
            } else {
                url += `&${paramsKey[i]}=${params[paramsKey[i]]}`;
            }
        }

        let response = await fetch(url);
        let data = await response.json();

        setDataTable(data);
    }

    useEffect(() => {
        loadDatatable();
    }, [params]);

    function onHandlePagination(e) {
        e.preventDefault();

        let page = e.target.href.split("page=")[1];
        page = page.split("&")[0];

        setParams({
            ...params,
            page: page,
        });
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
            roles: ["Superadmin", "Admin", "Manager"],
            header: "Klien",
            render: (item) => item.user.name,
            footer: (
                <FormSearch
                    name="client"
                    onChange={(e) =>
                        setParams({ ...params, client: e.target.value })
                    }
                    placeholder="Filter Klien"
                />
            ),
        },
        {
            header: "Lokasi",
            render: (item) => item.location,
            footer: (
                <FormSearch
                    name="location"
                    onChange={(e) =>
                        setParams({ ...params, location: e.target.value })
                    }
                    placeholder="Filter Lokasi"
                />
            ),
        },
        {
            header: "Jenis",
            render: (item) => item.service_item_type.name,
            footer: (
                <FormSearch
                    name="service_type"
                    onChange={(e) =>
                        setParams({
                            ...params,
                            service_item_type: e.target.value,
                        })
                    }
                    placeholder="Filter Jenis"
                />
            ),
        },
        {
            header: "Item",
            render: (item) => item.name,
            footer: (
                <FormSearch
                    name="name"
                    onChange={(e) =>
                        setParams({ ...params, name: e.target.value })
                    }
                    placeholder="Filter Item"
                />
            ),
        },
        {
            header: "Merek",
            render: (item) => item.merk,
            footer: (
                <FormSearch
                    name="merk"
                    onChange={(e) =>
                        setParams({ ...params, merk: e.target.value })
                    }
                    placeholder="Filter Merek"
                />
            ),
        },
        {
            header: "Model",
            render: (item) => item.model,
            footer: (
                <FormSearch
                    name="model"
                    onChange={(e) =>
                        setParams({ ...params, model: e.target.value })
                    }
                    placeholder="Filter Model"
                />
            ),
        },
        {
            header: "Nomor Seri",
            render: (item) => item.identify_number,
            footer: (
                <FormSearch
                    name="identify_number"
                    onChange={(e) =>
                        setParams({
                            ...params,
                            identify_number: e.target.value,
                        })
                    }
                    placeholder="Filter Nomor Seri"
                />
            ),
        },
        {
            header: "Maintenance Terakhir",
            render: (item) => formatIndonesianDate(item.last_maintenance_date),
            footer: (
                <FormSearch
                    name="maintenance_month"
                    type="month"
                    onChange={(e) =>
                        setParams({
                            ...params,
                            maintenance_month: e.target.value,
                        })
                    }
                />
            ),
        },
        {
            header: "Aksi",
            render: (item) => (
                <Tooltip text="Lihat Maintenance">
                    <Link
                        href={`client-inventories/${item.id}/maintenances`}
                        className="ml-2 text-gray-600 dark:text-gray-400 hover:underline"
                    >
                        <Info className="size-4" />
                    </Link>
                </Tooltip>
            ),
        },
    ];

    return (
        <RootLayout title="Inventaris Klien">
            <ContentCard title="Inventaris Klien">
                <DataTable
                    columns={columns}
                    dataTable={dataTable}
                    onChangePage={onHandlePagination}
                    onParamsChange={(e) =>
                        setParams({
                            ...params,
                            [e.target.name]: e.target.value,
                        })
                    }
                />
            </ContentCard>
        </RootLayout>
    );
}
