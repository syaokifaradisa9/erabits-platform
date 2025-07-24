import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import FormSelect from "@/Components/Forms/FormSelect";
import GeneralTable from "@/Components/Tables/GeneralTable";
import Tooltip from "../../Components/Common/Tooltip";
import { Link } from "@inertiajs/react";
import { SquarePen, Wrench, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import FormInput from "@/Components/Forms/FormInput";

export default function WorksheetIndex({ order, maintenances }) {
    const [params, setParams] = useState({ search: "", status: "ALL" });
    const [sortConfig, setSortConfig] = useState({
        key: "estimation_date",
        direction: "ascending",
    });

    const enabledMaintenanceIds = useMemo(() => {
        const groupedByItemOrder = maintenances.reduce((acc, item) => {
            const key = item.item_order_id;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});

        const enabledIds = new Set();
        const now = new Date().getTime();

        for (const itemOrderId in groupedByItemOrder) {
            const group = groupedByItemOrder[itemOrderId];
            const finished = group.filter((item) => item.finish_date);
            const unfinished = group.filter((item) => !item.finish_date);

            finished.forEach((item) => enabledIds.add(item.id));

            if (unfinished.length > 0) {
                let nearestTask = null;
                let smallestDiff = Infinity;

                unfinished.forEach((task) => {
                    const taskTime = new Date(task.estimation_date).getTime();
                    const diff = Math.abs(now - taskTime);
                    if (diff < smallestDiff) {
                        smallestDiff = diff;
                        nearestTask = task;
                    }
                });

                if (nearestTask) {
                    enabledIds.add(nearestTask.id);
                }
            }
        }

        return enabledIds;
    }, [maintenances]);

    const filteredAndSortedMaintenances = useMemo(() => {
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

        if (sortConfig.key) {
            filteredData.sort((a, b) => {
                const resolvePath = (object, path) =>
                    path.split(".").reduce((o, p) => (o ? o[p] : null), object);

                const aValue = resolvePath(a, sortConfig.key);
                const bValue = resolvePath(b, sortConfig.key);

                if (aValue < bValue) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredData;
    }, [maintenances, params, sortConfig]);

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

    function handleSort(key) {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    }

    const headers = [
        { label: "No" },
        {
            label: "Layanan",
            sortable: true,
            field: "item_order.item.service_item_type.name",
        },
        { label: "Item", sortable: true, field: "item_order.name" },
        { label: "Merek, Model, SN" },
        { label: "Estimasi Jadwal", sortable: true, field: "estimation_date" },
        { label: "Tanggal Pengerjaan", sortable: true, field: "finish_date" },
        { label: "Aksi" },
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
        {
            render: (item) => {
                const isEnabled = enabledMaintenanceIds.has(item.id);
                if (!isEnabled) {
                    return "-";
                }

                const hasBrokenChecklist = item.checklists.some(
                    (checklist) => checklist.condition === "Rusak"
                );

                return (
                    <div className="flex flex-wrap items-center">
                        <Tooltip text="Lembar Kerja">
                            <Link
                                href={
                                    isEnabled
                                        ? `/orders/${order.id}/worksheet/${item.id}`
                                        : "#"
                                }
                                className={`ml-2 ${
                                    isEnabled
                                        ? "text-gray-600 dark:text-gray-400 hover:underline"
                                        : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                }`}
                                as="button"
                                disabled={!isEnabled}
                            >
                                <SquarePen className="size-4" />
                            </Link>
                        </Tooltip>
                        {hasBrokenChecklist && (
                            <Tooltip text="Perbaikan">
                                <Link
                                    href={
                                        isEnabled
                                            ? `/orders/${order.id}/worksheet/${item.id}`
                                            : "#"
                                    }
                                    className={`ml-2 ${
                                        isEnabled
                                            ? "text-gray-600 dark:text-gray-400 hover:underline"
                                            : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                    }`}
                                    as="button"
                                    disabled={!isEnabled}
                                >
                                    <Wrench className="size-4" />
                                </Link>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <RootLayout title={`Lembar Kerja - ${order.number}`}>
            <ContentCard title="Lembar Kerja Order" backPath="/orders">
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
                            placeholder="Cari Pengerjaan"
                        />
                    </div>
                </div>
                <GeneralTable
                    headers={headers.map((header) => ({
                        ...header,
                        label: (
                            <div className="flex items-center">
                                {header.label}
                                {header.sortable && (
                                    <button
                                        onClick={() => handleSort(header.field)}
                                        className="ml-2"
                                    >
                                        <ArrowUpDown className="size-4" />
                                    </button>
                                )}
                            </div>
                        ),
                    }))}
                    items={filteredAndSortedMaintenances}
                    columns={columns}
                />
            </ContentCard>
        </RootLayout>
    );
}
