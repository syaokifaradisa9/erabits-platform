import { useForm } from "@inertiajs/react";
import ContentCard from "@/Components/Layouts/ContentCard";
import RootLayout from "@/Layouts/RootLayout";
import FormInput from "@/Components/Forms/FormInput";
import Button from "@/Components/Buttons/Button";
import { Save, Plus, Trash2 } from "lucide-react";

export default function ItemCreate({ item }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: item?.name || "",
        price: item?.price || "",
        maintenance_count: item?.maintenance_count || "",
        item_checklists: item?.item_checklists || [],
    });

    const addItemChecklist = () => {
        setData("item_checklists", [
            ...data.item_checklists,
            { name: "", description: "" },
        ]);
    };

    const removeItemChecklist = (index) => {
        const newItemChecklists = [...data.item_checklists];
        newItemChecklists.splice(index, 1);
        setData("item_checklists", newItemChecklists);
    };

    const handleChecklistChange = (index, field, value) => {
        const newItemChecklists = [...data.item_checklists];
        newItemChecklists[index][field] = value;
        setData("item_checklists", newItemChecklists);
    };

    function onSubmit(e) {
        e.preventDefault();
        if (item) {
            put(`/items/${item.id}/update`);
            return;
        }

        post("/items/store");
    }

    return (
        <RootLayout title="Tambah Data Item Maintenance">
            <ContentCard title="Tambah Data Item Maintenance" backPath="/items">
                <form method="post" onSubmit={onSubmit}>
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormInput
                            name="name"
                            label="Nama Item"
                            error={errors.name}
                            placeholder="Isikan Nama Item"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <FormInput
                            name="price"
                            label="Tarif Item"
                            error={errors.price}
                            placeholder="Isikan Tarif Item"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                        />
                        <FormInput
                            name="maintenance_count"
                            label="Jumlah Pemeliharaan"
                            error={errors.maintenance_count}
                            placeholder="Isikan Jumlah Pemeliharaan"
                            value={data.maintenance_count}
                            onChange={(e) =>
                                setData("maintenance_count", e.target.value)
                            }
                        />
                    </div>

                    <div className="mt-6">
                        {data.item_checklists.map((checklist, index) => (
                            <div
                                key={index}
                                className="grid gap-4 pb-4 mb-4 rounded-lg shadow-sm md:grid-cols-2"
                            >
                                <FormInput
                                    name={`item_checklists[${index}].name`}
                                    label="Nama Checklist"
                                    error={
                                        errors[`item_checklists.${index}.name`]
                                    }
                                    placeholder="Isikan Nama Checklist"
                                    value={checklist.name}
                                    onChange={(e) =>
                                        handleChecklistChange(
                                            index,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                />
                                <FormInput
                                    name={`item_checklists[${index}].description`}
                                    label="Deskripsi Checklist"
                                    error={
                                        errors[
                                            `item_checklists.${index}.description`
                                        ]
                                    }
                                    placeholder="Isikan Deskripsi Checklist"
                                    value={checklist.description}
                                    onChange={(e) =>
                                        handleChecklistChange(
                                            index,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                />
                                <div className="flex justify-end md:col-span-2">
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            removeItemChecklist(index)
                                        }
                                        className="text-red-600 bg-transparent border border-red-600 hover:bg-red-600 hover:text-white"
                                        icon={<Trash2 className="size-4" />}
                                        label="Hapus Checklist"
                                    />
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={addItemChecklist}
                            className="w-full !text-gray-600 bg-white border border-gray-600 border-dashed dark:!text-white dark:border-gray-300 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                            icon={<Plus className="size-4" />}
                            label="Tambah Checklist"
                        />
                    </div>

                    <Button
                        isLoading={processing}
                        type="submit"
                        className="w-full mt-3"
                        label="Simpan"
                        icon={<Save className="size-4" />}
                    />
                </form>
            </ContentCard>
        </RootLayout>
    );
}
