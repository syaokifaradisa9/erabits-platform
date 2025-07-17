import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import { useState, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import OrderTable from "./OrderTable";
import Button from "@/Components/Buttons/Button";
import { Search, SendHorizonal } from "lucide-react";

export default function Create({ items, serviceItemTypes }) {
    const allServiceItemTypes = [
        { id: "all", name: "Semua" },
        ...serviceItemTypes,
    ];
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");
    const [hideZero, setHideZero] = useState(false);

    const [displayItems, setDisplayItems] = useState(
        items.map((item) => ({ ...item, quantity: 0, notes: "" }))
    );

    const { data, setData, post, processing, errors } = useForm({
        items: [],
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
        post("/orders/store", {
            items: data.items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
            })),
        });
    };

    return (
        <RootLayout title="Buat Permintaan Alkes">
            <ContentCard title="Permintaan Pemeliharaan">
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
                                onChange={(e) => setHideZero(e.target.checked)}
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
                    <form onSubmit={handleSubmit}>
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
                            label="Buat Permintaan"
                            isLoading={processing}
                            type="submit"
                            icon={<SendHorizonal className="w-4 h-4" />}
                        />
                    </form>
                </div>
            </ContentCard>
        </RootLayout>
    );
}
