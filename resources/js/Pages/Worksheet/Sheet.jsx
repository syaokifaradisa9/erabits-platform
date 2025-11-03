import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import { useForm } from "@inertiajs/react";
import ForEach from "@/utils/ForEachUtils";
import FormSelect from "@/Components/Forms/FormSelect";
import FormInput from "@/Components/Forms/FormInput";
import Button from "@/Components/Buttons/Button";
import { Save } from "lucide-react";

export default function WorksheetSheet({ order, maintenance, conditions }) {
    const { data, setData, post, errors } = useForm({
        merk: maintenance.item_order.merk ?? "",
        model: maintenance.item_order.model ?? "",
        identify_number: maintenance.item_order.identify_number ?? "",
        location: maintenance.client_inventory_maintenance?.location ?? "",
        finish_date: maintenance.finish_date
            ? new Date(maintenance.finish_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        checklists:
            maintenance.checklists && maintenance.checklists.length > 0
                ? maintenance.checklists.map((checklist) => ({
                      ...checklist,
                      repair_status: checklist.repair_status || null,
                      repair_cost_estimate: checklist.repair_cost_estimate || "",
                      repair_notes: checklist.repair_notes || "",
                      repair_started_at: checklist.repair_started_at || null,
                      repair_completed_at: checklist.repair_completed_at || null,
                  }))
                : maintenance.item_order.item.checklists.map((checklist) => ({
                      item_checklist_id: checklist.id,
                      name: checklist.name,
                      description: checklist.description,
                      condition: "Baik",
                      fix_action: "", // ganti dari repair_action
                      notes: "",
                      repair_status: null,
                      repair_cost_estimate: "",
                      repair_notes: "",
                      repair_started_at: null,
                      repair_completed_at: null,
                  })),
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(`/orders/${order.id}/worksheet/${maintenance.id}/store`);
    }

    return (
        <RootLayout title={`Lembar Kerja - ${order.number}`}>
            <ContentCard
                title={`Form Checklist - ${maintenance.item_order.name}`}
                backPath={`/orders/${order.id}/worksheet`}
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-4">
                        <FormInput
                            label="Merek"
                            name="merk"
                            value={data.merk}
                            placeholder="Isikan Merek Item"
                            onChange={(e) => setData("merk", e.target.value)}
                            error={errors.merk}
                        />
                        <FormInput
                            label="Model"
                            name="model"
                            placeholder="Isikan Model Item"
                            value={data.model}
                            onChange={(e) => setData("model", e.target.value)}
                            error={errors.model}
                        />
                        <FormInput
                            label="Serial Number"
                            name="identify_number"
                            placeholder="Isikan Nomor Seri Item"
                            value={data.identify_number}
                            onChange={(e) =>
                                setData("identify_number", e.target.value)
                            }
                            error={errors.identify_number}
                        />
                        <FormInput
                            label="Lokasi"
                            name="location"
                            placeholder="Isikan Lokasi Item"
                            value={data.location}
                            onChange={(e) =>
                                setData("location", e.target.value)
                            }
                            error={errors.location}
                        />
                    </div>
                    <div className="mb-4">
                        <FormInput
                            label="Tanggal Pengerjaan"
                            type="date"
                            name="finish_date"
                            value={data.finish_date}
                            onChange={(e) =>
                                setData("finish_date", e.target.value)
                            }
                            error={errors.finish_date}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <ForEach
                            lists={data.checklists}
                            child={(checklist, index) => (
                                <div
                                    key={index}
                                    className="p-4 border rounded-md dark:border-slate-700"
                                >
                                    <h3 className="font-semibold dark:text-white">
                                        {checklist.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-slate-400">
                                        {checklist.description}
                                    </p>
                                    <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
                                        <FormSelect
                                            label="Kondisi"
                                            value={checklist.condition}
                                            onChange={(e) => {
                                                const newChecklists = [
                                                    ...data.checklists,
                                                ];
                                                newChecklists[index].condition =
                                                    e.target.value;
                                                setData(
                                                    "checklists",
                                                    newChecklists
                                                );
                                            }}
                                            options={conditions.map(
                                                (condition) => ({
                                                    value: condition,
                                                    label: condition,
                                                })
                                            )}
                                        />
                                        {checklist.condition === "Rusak" && (
                                            <>
                                                <FormInput
                                                    label="Aksi Perbaikan"
                                                    value={checklist.fix_action}
                                                    onChange={(e) => {
                                                        const newChecklists = [
                                                            ...data.checklists,
                                                        ];
                                                        newChecklists[
                                                            index
                                                        ].fix_action =
                                                            e.target.value;
                                                        setData(
                                                            "checklists",
                                                            newChecklists
                                                        );
                                                    }}
                                                />
                                                <FormSelect
                                                    label="Status Perbaikan"
                                                    value={checklist.repair_status || ""}
                                                    onChange={(e) => {
                                                        const newChecklists = [
                                                            ...data.checklists,
                                                        ];
                                                        newChecklists[
                                                            index
                                                        ].repair_status =
                                                            e.target.value;
                                                        setData(
                                                            "checklists",
                                                            newChecklists
                                                        );
                                                    }}
                                                    options={[
                                                        { value: "", label: "Pilih Status" },
                                                        { value: "pending", label: "Menunggu Persetujuan" },
                                                        { value: "in_progress", label: "Dalam Perbaikan" },
                                                        { value: "completed", label: "Selesai" },
                                                        { value: "declined", label: "Ditolak" },
                                                    ]}
                                                />
                                                <FormInput
                                                    label="Estimasi Biaya (Rp)"
                                                    type="number"
                                                    value={checklist.repair_cost_estimate}
                                                    onChange={(e) => {
                                                        const newChecklists = [
                                                            ...data.checklists,
                                                        ];
                                                        newChecklists[
                                                            index
                                                        ].repair_cost_estimate =
                                                            e.target.value;
                                                        setData(
                                                            "checklists",
                                                            newChecklists
                                                        );
                                                    }}
                                                />
                                                <FormInput
                                                    label="Catatan Perbaikan"
                                                    value={checklist.repair_notes}
                                                    onChange={(e) => {
                                                        const newChecklists = [
                                                            ...data.checklists,
                                                        ];
                                                        newChecklists[
                                                            index
                                                        ].repair_notes =
                                                            e.target.value;
                                                        setData(
                                                            "checklists",
                                                            newChecklists
                                                        );
                                                    }}
                                                />
                                            </>
                                        )}
                                        <FormInput
                                            label="Catatan"
                                            value={checklist.notes}
                                            error={errors[`checklists.${index}.notes`]}
                                            onChange={(e) => {
                                                const newChecklists = [
                                                    ...data.checklists,
                                                ];
                                                newChecklists[index].notes =
                                                    e.target.value;
                                                setData(
                                                    "checklists",
                                                    newChecklists
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                    <Button
                        type="submit"
                        label="Simpan"
                        className="w-full mt-4"
                        icon={<Save className="size-4" />}
                    />
                </form>
            </ContentCard>
        </RootLayout>
    );
}
