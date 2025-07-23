import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import { useState, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import OrderTable from "./OrderTable";
import Button from "@/Components/Buttons/Button";
import { Search, SendHorizonal } from "lucide-react";
import FormSelect from "@/Components/Forms/FormSelect";
import CheckRoles from "@/utils/CheckRoles";

export default function Create({
    order,
    items,
    serviceItemTypes,
    quantifiedItems = [],
    clients = [],
}) {
    const allServiceItemTypes = [
        { id: "all", name: "Semua" },
        ...serviceItemTypes,
    ];
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");
    const [hideZero, setHideZero] = useState(false);

    const [displayItems, setDisplayItems] = useState(
        items.map((item) => {
            const quantifiedItem = quantifiedItems.find(
                (qi) => qi.item_id === item.id
            );
            return {
                ...item,
                quantity: quantifiedItem ? quantifiedItem.quantity : 0,
                notes: "",
            };
        })
    );

    const { data, setData, post, processing, put, errors } = useForm({
        client_id: order?.client_id,
        items: quantifiedItems.map((item) => ({
            id: item.item_id,
            quantity: item.quantity,
            notes: "",
        })),
    });

    const handleQuantityChange = (index, value) => {
        const newDisplayItems = [...displayItems];
        newDisplayItems[index].quantity = value;
        setDisplayItems(newDisplayItems);

        const itemsToOrder = newDisplayItems.filter(
            (item) => Number(item.quantity) > 0
        );
        setData("items", itemsToOrder);
    };

    const filteredItems = useMemo(() => {
        return displayItems
            .map((item, index) => ({ ...item, originalIndex: index }))
            .filter(
                (item) =>
                    (activeTab === "all" ||
                        item.service_item_type_id === activeTab) &&
                    item.name.toLowerCase().includes(search.toLowerCase()) &&
                    (!hideZero || item.quantity > 0)
            );
    }, [displayItems, activeTab, search, hideZero]);

    const total = useMemo(() => {
        return displayItems.reduce(
            (acc, item) => acc + item.price * (item.quantity || 0),
            0
        );
    }, [displayItems]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...data,
            items: data.items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                notes: item.notes,
            })),
        };

        console.log(data);

        if (order) {
            put(`/orders/${order.id}/update`, submissionData);
        } else {
            post(`/orders/store`, submissionData);
        }
    };

    return (
        <RootLayout
            title={order ? "Edit Permintaan Alkes" : "Buat Permintaan Alkes"}
        >
            <ContentCard
                backPath="/orders"
                title={
                    order
                        ? "Edit Permintaan Pemeliharaan"
                        : "Permintaan Pemeliharaan"
                }
            >
                <form onSubmit={handleSubmit}>
                    <CheckRoles
                        roles={["Superadmin", "Admin", "Manager"]}
                        children={
                            <FormSelect
                                label="Client"
                                placeholder="Pilih Client"
                                value={data.client_id}
                                onChange={(e) =>
                                    setData("client_id", e.target.value)
                                }
                                options={clients.map((client) => {
                                    return {
                                        label: client.name,
                                        value: client.id,
                                    };
                                })}
                                error={errors.client_id}
                            />
                        }
                    />
                    <div className="flex border-b dark:border-gray-700">
                        {allServiceItemTypes.map((type) => (
                            <button
                                key={type.id}
                                className={`px-4 py-0 ${
                                    activeTab === type.id
                                        ? "border-b-2 border-blue-500 text-blue-500"
                                        : "text-gray-500 dark:text-gray-400"
                                }`}
                                onClick={() => setActiveTab(type.id)}
                            >
                                {type.name}
                            </button>
                        ))}
                    </div>
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="hideZero"
                                    checked={hideZero}
                                    onChange={(e) =>
                                        setHideZero(e.target.checked)
                                    }
                                    className="dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label
                                    htmlFor="hideZero"
                                    className="ml-2 text-sm dark:text-gray-300"
                                >
                                    Sembunyikan jumlah permintaan yang 0
                                </label>
                            </div>
                            <div className="relative w-full md:w-80">
                                <Search className="absolute -translate-y-1/2 left-3 top-1/2 size-4 text-slate-400" />
                                <input
                                    name="search"
                                    type="text"
                                    className="w-full pl-10 pr-4 text-sm transition-colors bg-white border border-gray-400 rounded-lg h-9 text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                    placeholder="Cari data..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <OrderTable
                            items={filteredItems}
                            quantities={filteredItems.map(
                                (item) => item.quantity
                            )}
                            onChange={(index, value) => {
                                const originalIndex =
                                    filteredItems[index].originalIndex;
                                handleQuantityChange(originalIndex, value);
                            }}
                            total={total}
                            showCategory={activeTab == "all"}
                        />
                        <Button
                            className="w-full mt-4"
                            label={
                                order ? "Update Permintaan" : "Buat Permintaan"
                            }
                            isLoading={processing}
                            type="submit"
                            icon={<SendHorizonal className="w-4 h-4" />}
                        />
                    </div>
                </form>
            </ContentCard>
        </RootLayout>
    );
}
