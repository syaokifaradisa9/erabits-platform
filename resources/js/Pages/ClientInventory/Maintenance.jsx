import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import GeneralTable from "@/Components/Tables/GeneralTable";

export default function Maintenance({ inventory }) {
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

    const headers = [
        { label: "No" },
        { label: "Lokasi" },
        { label: "Tanggal Pengerjaan" },
    ];

    const columns = [
        {
            render: (item, index) => index + 1,
        },
        {
            render: (item) => item.location,
        },
        {
            render: (item) =>
                formatIndonesianDate(item.item_order_maintenance.finish_date),
        },
    ];

    const title = `Riwayat Maintenance - ${inventory.name} Merk : ${inventory.merk}, Model : ${inventory.model}, SN : ${inventory.identify_number}`;
    return (
        <RootLayout title={title}>
            <ContentCard title={title} backPath="/client-inventories">
                <GeneralTable
                    headers={headers}
                    items={inventory.maintenances}
                    columns={columns}
                />
            </ContentCard>
        </RootLayout>
    );
}
