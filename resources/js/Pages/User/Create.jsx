import RootLayout from "@/Layouts/RootLayout";
import ContentCard from "@/Components/Layouts/ContentCard";
import Button from "@/Components/Buttons/Button";
import { useForm } from "@inertiajs/react";
import FormInput from "@/Components/Forms/FormInput";
import FormSelect from "@/Components/Forms/FormSelect";

export default function UserCreate({ user, roles }) {
    const { data, setData, post, put, errors, processing } = useForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        password: "",
        password_confirmation: "",
        role: user?.roles[0]?.name || "",
    });

    function onSubmit(e) {
        e.preventDefault();
        if (user) {
            put(route("users.update", { user: user.id }));
        } else {
            post(route("users.store"));
        }
    }

    return (
        <RootLayout title={`${user ? "Edit" : "Tambah"} Pengguna`}>
            <ContentCard title={`${user ? "Edit" : "Tambah"} Pengguna`}>
                <form onSubmit={onSubmit} className="space-y-4">
                    <FormInput
                        label="Nama"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        error={errors.name}
                        required
                    />
                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        error={errors.email}
                        required
                    />
                    <FormInput
                        label="Telepon"
                        name="phone"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        error={errors.phone}
                    />
                    <FormSelect
                        label="Role"
                        name="role"
                        value={data.role}
                        onChange={(e) => setData("role", e.target.value)}
                        error={errors.role}
                        required
                        options={roles.map((role) => ({
                            value: role.name,
                            label: role.name,
                        }))}
                    />
                    <FormInput
                        label="Password"
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.targe.value)}
                        error={errors.password}
                        required={!user}
                    />
                    <FormInput
                        label="Konfirmasi Password"
                        name="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required={!user || data.password}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            label={user ? "Simpan Perubahan" : "Simpan"}
                            isLoading={processing}
                        />
                    </div>
                </form>
            </ContentCard>
        </RootLayout>
    );
}
