import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import { useForm } from "@inertiajs/react";
import ForEach from "@/utils/ForEachUtils";
import FormSelect from "@/Components/Forms/FormSelect";
import FormInput from "@/Components/Forms/FormInput";
import Button from "@/Components/Buttons/Button";
import { Save } from "lucide-react";

export default function WorksheetSheet({ order, maintenance, conditions }) {
    const { data, setData, post, errors, processing } = useForm({
        merk: maintenance.item_order.merk ?? "",
        model: maintenance.item_order.model ?? "",
        identify_number: maintenance.item_order.identify_number ?? "",
        location: maintenance.client_inventory_maintenance?.location ?? "",
        finish_date: maintenance.finish_date
            ? new Date(maintenance.finish_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        image: null, // for after maintenance image
        asset_image: null, // for asset identification image
        delete_image: false, // flag to delete existing image
        delete_asset_image: false, // flag to delete existing asset image
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
        post(`/orders/${order.id}/worksheet/${maintenance.id}/store`, {
            forceFormData: true
        });
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
                                                {/* Tampilkan riwayat perbaikan sebelumnya */}
                                                {/* Riwayat perbaikan sebelumnya dari current checklist */}
                                                {(checklist.fix_action || checklist.repair_status || checklist.repair_cost_estimate || checklist.repair_notes) && (
                                                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600">
                                                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Perbaikan Saat Ini</h5>
                                                        {checklist.fix_action && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="font-medium">Aksi:</span> {checklist.fix_action}
                                                            </p>
                                                        )}
                                                        {checklist.repair_status && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="font-medium">Status:</span> 
                                                                {checklist.repair_status === 'pending' ? 'Menunggu Persetujuan' :
                                                                 checklist.repair_status === 'in_progress' ? 'Dalam Perbaikan' :
                                                                 checklist.repair_status === 'completed' ? 'Selesai' :
                                                                 checklist.repair_status === 'declined' ? 'Ditolak' : checklist.repair_status}
                                                            </p>
                                                        )}
                                                        {checklist.repair_cost_estimate && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="font-medium">Biaya:</span> Rp{Number(checklist.repair_cost_estimate).toLocaleString('id-ID')}
                                                            </p>
                                                        )}
                                                        {checklist.repair_notes && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="font-medium">Catatan:</span> {checklist.repair_notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Riwayat perbaikan dari database sebelumnya */}
                                                {checklist.repair_histories && checklist.repair_histories.length > 0 && (
                                                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                                                        <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Riwayat Perbaikan Sebelumnya</h5>
                                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                                            {checklist.repair_histories.map((history, histIndex) => (
                                                                <div key={history.id} className="text-sm text-blue-700 dark:text-blue-300 p-2 bg-blue-100 dark:bg-blue-800/50 rounded">
                                                                    <div className="flex justify-between">
                                                                        <span className="font-medium">
                                                                            {history.activity_type === 'repair_status_change' && 'Perubahan Status:'}
                                                                            {history.activity_type === 'condition_change' && 'Perubahan Kondisi:'}
                                                                            {history.activity_type === 'client_approval' && 'Persetujuan Klien:'}
                                                                            {history.activity_type === 'client_decline' && 'Penolakan Klien:'}
                                                                            {!history.activity_type && 'Aktivitas:'}
                                                                        </span>
                                                                        <span>{history.updated_at}</span>
                                                                    </div>
                                                                    <div>
                                                                        {history.old_status ? `'${history.old_status}' → '${history.new_status}'` : `'${history.new_status}'`}
                                                                    </div>
                                                                    {history.notes && (
                                                                        <div>
                                                                            {history.notes}
                                                                        </div>
                                                                    )}
                                                                    <div className="text-xs italic">
                                                                        Oleh: {history.updated_by}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
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

                                            </>
                                        )}
                                        
                                        {/* Bagian untuk perbaikan lanjutan */}
                                        {checklist.condition === "Rusak" && (
                                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                                                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Perbaikan Lanjutan</h4>
                                                <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                                                    Tambahkan perbaikan lanjutan untuk checklist ini.
                                                </p>
                                                <FormInput
                                                    label="Aksi Perbaikan Lanjutan"
                                                    value={checklist.additional_fix_action || ""}
                                                    onChange={(e) => {
                                                        const newChecklists = [
                                                            ...data.checklists,
                                                        ];
                                                        newChecklists[
                                                            index
                                                        ].additional_fix_action =
                                                            e.target.value;
                                                        setData(
                                                            "checklists",
                                                            newChecklists
                                                        );
                                                    }}
                                                    placeholder="Tambahkan aksi perbaikan baru"
                                                />
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <FormInput
                            type="file"
                            name="asset_image"
                            label="Foto Alat"
                            onChange={(e) => setData("asset_image", e.target.files[0])}
                            error={errors.asset_image}
                            helpText="Upload foto alat sebelum pemeliharaan (opsional)"
                        />
                    </div>
                    
                    {maintenance.asset_image_path && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Foto Alat Sebelumnya:</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Tambahkan flag untuk menghapus gambar yang sudah ada
                                        setData('delete_asset_image', true);
                                    }}
                                    className="inline-flex items-center px-2 py-1 text-sm font-medium text-center text-white bg-red-600 rounded-md hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                                >
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Hapus
                                </button>
                            </div>
                            <div className="relative">
                                <img 
                                    src={`/storage/${maintenance.asset_image_path}`} 
                                    alt="Foto alat sebelumnya" 
                                    className="w-40 h-40 object-cover rounded-lg border border-gray-200"
                                />
                                {data.delete_asset_image && (
                                    <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center rounded-lg">
                                        <span className="text-white font-bold">Akan Dihapus</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <div className="mb-4">
                        <FormInput
                            type="file"
                            name="image"
                            label="Bukti Pemeliharaan"
                            onChange={(e) => setData("image", e.target.files[0])}
                            error={errors.image}
                            helpText="Upload foto bukti pemeliharaan (opsional)"
                        />
                    </div>
                    
                    {maintenance.image_path && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Bukti Pemeliharaan Sebelumnya:</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Tambahkan flag untuk menghapus gambar yang sudah ada
                                        setData('delete_image', true);
                                    }}
                                    className="inline-flex items-center px-2 py-1 text-sm font-medium text-center text-white bg-red-600 rounded-md hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                                >
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Hapus
                                </button>
                            </div>
                            <div className="relative">
                                <img 
                                    src={`/storage/${maintenance.image_path}`} 
                                    alt="Foto bukti pemeliharaan sebelumnya" 
                                    className="w-40 h-40 object-cover rounded-lg border border-gray-200"
                                />
                                {data.delete_image && (
                                    <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center rounded-lg">
                                        <span className="text-white font-bold">Akan Dihapus</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <Button
                        type="submit"
                        label="Simpan"
                        className="w-full mt-4"
                        icon={<Save className="size-4" />}
                        isLoading={processing}
                    />
                </form>
            </ContentCard>
        </RootLayout>
    );
}
