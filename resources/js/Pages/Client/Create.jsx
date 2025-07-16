import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import Button from "@/Components/Buttons/Button";
import { useForm } from "@inertiajs/react";
import FormInput from "@/Components/Forms/FormInput";
import FormTextArea from "@/Components/Forms/FormTextArea";
import { Save } from "lucide-react";

export default function ClientCreate({ client }) {
    const { data, setData, post, put, errors, processing } = useForm({
        name: client?.name || "",
        email: client?.email || "",
        phone: client?.phone || "",
        province: client?.province || "",
        city: client?.city || "",
        address: client?.address || "",
        password: "",
        password_confirmation: "",
    });

    function onSubmit(e) {
        e.preventDefault();
        if (client) {
            put(`/clients/${client.id}/update`);
        } else {
            post("/clients/store");
        }
    }

    return (
        <RootLayout title={`${client ? "Edit" : "Tambah"} Klien`}>
            <ContentCard
                title={`${client ? "Edit" : "Tambah"} Klien`}
                backPath="/clients"
            >
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormInput
                            label="Nama"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            error={errors.name}
                            placeholder="Masukkan nama klien"
                        />
                        <FormInput
                            prefix="+62"
                            label="Telepon"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            error={errors.phone}
                            placeholder="Masukkan nomor telepon"
                        />
                        <FormInput
                            label="Provinsi"
                            name="province"
                            value={data.province}
                            onChange={(e) =>
                                setData("province", e.target.value)
                            }
                            error={errors.province}
                            placeholder="Masukkan provinsi"
                        />
                        <FormInput
                            label="Kota"
                            name="city"
                            value={data.city}
                            onChange={(e) => setData("city", e.target.value)}
                            error={errors.city}
                            placeholder="Masukkan kota"
                        />
                    </div>
                    <FormTextArea
                        label="Alamat"
                        name="address"
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                        error={errors.address}
                        className="mt-4"
                        placeholder="Masukkan alamat lengkap"
                    />
                    <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            error={errors.email}
                            placeholder="Masukkan email klien"
                        />
                        <FormInput
                            label="Password"
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            error={errors.password}
                            placeholder="Masukkan password"
                        />
                        <FormInput
                            label="Konfirmasi Password"
                            name="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            placeholder="Konfirmasi password"
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button
                            type="submit"
                            label={client ? "Simpan Perubahan" : "Simpan"}
                            isLoading={processing}
                            className="w-full"
                            icon={<Save className="size-4" />}
                        />
                    </div>
                </form>
            </ContentCard>
        </RootLayout>
    );
}
