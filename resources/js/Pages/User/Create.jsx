import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import Button from "@/Components/Buttons/Button";
import { useForm } from "@inertiajs/react";
import FormInput from "@/Components/Forms/FormInput";
import FormSelect from "@/Components/Forms/FormSelect";
import FormTextArea from "@/Components/Forms/FormTextArea";
import { Save } from "lucide-react";
import CheckRoles from "@/utils/CheckRoles";

export default function UserCreate({ user, serviceItemTypes, roles }) {
    const { data, setData, post, put, errors, processing } = useForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        province: user?.province || "",
        city: user?.city || "",
        address: user?.address || "",
        service_item_type_id: user?.service_item_type_id || "",
        role: user?.roles[0]?.name || "",
        password: "",
        password_confirmation: "",
    });

    function onSubmit(e) {
        e.preventDefault();
        if (user) {
            put(`/users/${user.id}/update`);
        } else {
            post("/users/store");
        }
    }

    return (
        <RootLayout title={`${user ? "Edit" : "Tambah"} Pengguna`}>
            <ContentCard
                title={`${user ? "Edit" : "Tambah"} Pengguna`}
                backPath="/users"
            >
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormInput
                            placeholder="Masukkan nama lengkap"
                            label="Nama"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            error={errors.name}
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
                        <CheckRoles
                            roles={["Superadmin", "Admin"]}
                            children={
                                <FormSelect
                                    label="Layanan"
                                    name="service_item_type_id"
                                    value={data.service_item_type_id}
                                    onChange={(e) =>
                                        setData(
                                            "service_item_type_id",
                                            e.target.value
                                        )
                                    }
                                    error={errors.service_item_type_id}
                                    options={serviceItemTypes.map((type) => ({
                                        value: type.id,
                                        label: type.name,
                                    }))}
                                    placeholder="Pilih jenis layanan"
                                />
                            }
                        />
                        <FormSelect
                            label="Hak Akses"
                            name="role"
                            value={data.role}
                            onChange={(e) => setData("role", e.target.value)}
                            error={errors.role}
                            options={roles.map((role) => ({
                                value: role,
                                label: role,
                            }))}
                            placeholder="Pilih hak akses"
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
                        placeholder="Masukkan alamat lengkap"
                        className="mt-4"
                    />

                    <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
                        <FormInput
                            placeholder="Masukkan email"
                            label="Email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            error={errors.email}
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
                        />
                        <FormInput
                            label="Konfirmasi Password"
                            name="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                        />
                    </div>
                    <Button
                        className="w-full mt-4"
                        type="submit"
                        label={user ? "Simpan Perubahan" : "Simpan"}
                        isLoading={processing}
                        icon={<Save className="size-4" />}
                    />
                </form>
            </ContentCard>
        </RootLayout>
    );
}
