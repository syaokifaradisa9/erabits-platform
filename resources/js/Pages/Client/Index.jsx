import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import { useEffect, useState } from "react";
import DataTable from "@/Components/Tables/Datatable";
import FormSearch from "@/Components/Forms/FormSearch";

export default function ClientIndex() {
    const [dataTable, setDataTable] = useState([]);
    const [params, setParams] = useState({
        search: "",
        limit: 20,
        page: 1,
    });

    async function loadDatatable() {
        let url = `${window.location.href}/datatable`;
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
    ];

    return (
        <RootLayout title="Manajemen Klien">
            <ContentCard title="Data Klien">
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
        </RootLayout>
    );
}
