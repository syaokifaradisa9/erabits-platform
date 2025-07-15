import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import Button from "@/Components/Buttons/Button";
import { useEffect, useState } from "react";
import { Edit, Plus, Printer } from "lucide-react";
import DataTable from "@/Components/Tables/Datatable";
import { Link } from "@inertiajs/react";
import DropdownButton from "@/Components/Buttons/DropdownButton";
import FormSearch from "../../Components/Forms/FormSearch";

export default function ItemIndex() {
    const [dataTable, setDataTable] = useState([]);
    const [params, setParams] = useState({
        search: "",
        limit: 20,
        page: 1,
        status: "ALL",
        condition: "ALL",
    });

    async function loadDatatable() {
        let url = `${window.location.href}/datatable`;
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

    function onChangePage(e) {
        e.preventDefault();

        let page = e.target.href.split("page=")[1];
        page = page.split("&")[0];

        setParams({
            ...params,
            page: page,
        });
    }

    function onParamsChange(e) {
        e.preventDefault();

        setParams({
            ...params,
            [e.target.name]: e.target.value,
        });
    }

    function onPrint(e, type) {
        let url = `${window.location.href}/print/${type}`;
        let paramsKey = Object.keys(params);
        for (let i = 0; i < paramsKey.length; i++) {
            if (i == 0) {
                url += `?${paramsKey[i]}=${params[paramsKey[i]]}`;
            } else {
                url += `&${paramsKey[i]}=${params[paramsKey[i]]}`;
            }
        }

        window.open(url, "_blank");
    }

    return (
        <RootLayout title="Data Master Kalibrator">
            <ContentCard
                title="Data Master Kalibrator"
                additionalButton={
                    <Button
                        className="w-full"
                        label="Tambah Data"
                        href="/calibrator/data/create"
                        icon={<Plus className="size-4" />}
                    />
                }
            >
                <DataTable
                    onChangePage={onChangePage}
                    onParamsChange={onParamsChange}
                    limit={params.limit}
                    dataTable={dataTable}
                    additionalHeaderElements={
                        <>
                            <Link href="/calibrator/data/batch/edit">
                                <Edit className="ml-1 text-gray-700 dark:text-gray-300 size-4" />
                            </Link>
                            <DropdownButton
                                icon={
                                    <Printer className="text-gray-700 dark:text-gray-300 size-4" />
                                }
                                items={[
                                    {
                                        label: "PDF",
                                        onClick: (e) => {
                                            onPrint(e, "pdf");
                                        },
                                    },
                                    {
                                        label: "Excel",
                                        onClick: (e) => {
                                            onPrint(e, "excel");
                                        },
                                    },
                                ]}
                            />
                        </>
                    }
                    columns={[
                        {
                            header: "Layanan",
                            render: (item) => item.service_item_type.name,
                            footer: (
                                <FormSearch
                                    name="service_type"
                                    onChange={onParamsChange}
                                    placeholder="Filter Layanan"
                                />
                            ),
                        },
                        {
                            header: "Item Maintenance",
                            render: (item) => item.name,
                            footer: (
                                <FormSearch
                                    name="name"
                                    onChange={onParamsChange}
                                    placeholder="Filter Nama Item"
                                />
                            ),
                        },
                        {
                            header: "Tarif",
                            render: (item) => item.price,
                            footer: (
                                <FormSearch
                                    name="price"
                                    onChange={onParamsChange}
                                    placeholder="Filter Tarif"
                                />
                            ),
                        },
                        {
                            header: "Jumlah Maintenance",
                            render: (item) => item.maintenance_count,
                            footer: (
                                <FormSearch
                                    name="maintenance_count"
                                    onChange={onParamsChange}
                                    placeholder="Filter Jumlah Maintenance"
                                />
                            ),
                        },
                        {
                            header: "Jumlah Checklist",
                            render: (item) => item.checklist_count,
                        },
                    ]}
                />
            </ContentCard>
        </RootLayout>
    );
}
