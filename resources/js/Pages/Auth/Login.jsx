import { Head, useForm, usePage } from "@inertiajs/react";
import { LogIn } from "lucide-react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import FormInput from "../../Components/forms/FormInput";
import Button from "../../Components/buttons/Button";

export default function Login() {
    const { setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const { flash } = usePage().props;

    useEffect(() => {
        const { type, message } = flash;
        if (type === "success") toast.success(message);
        if (type === "error") toast.error(message);
    }, [flash]);

    const onSubmit = (e) => {
        e.preventDefault();
        post("/auth/verify");
    };

    return (
        <>
            <Head title="Login | SIGALUH" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: "#363636",
                            color: "#fff",
                            borderRadius: "12px",
                            fontSize: "14px",
                        },
                    }}
                />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-primary/20 blur-3xl"></div>
                    <div className="absolute rounded-full -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary/20 to-primary/20 blur-3xl"></div>
                </div>
                <main className="relative flex items-center justify-center min-h-screen p-4">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center">
                            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                Selamat Datang Kembali
                            </h1>
                            <p className="text-gray-600 dark:text-slate-400">
                                Masuk ke akun SIGALUH Anda
                            </p>
                        </div>
                        <div className="p-8 border shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-gray-200/50 dark:shadow-slate-900/50 border-white/20 dark:border-slate-700/50">
                            <form onSubmit={onSubmit} className="space-y-6">
                                <FormInput
                                    label="Email"
                                    name="email"
                                    placeholder="nama@perusahaan.com"
                                    type="email"
                                    error={errors?.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <FormInput
                                    label="Password"
                                    name="password"
                                    placeholder="••••••••••"
                                    type="password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    error={errors?.password}
                                />
                                <Button
                                    isLoading={processing}
                                    label={
                                        processing
                                            ? "Memverifikasi..."
                                            : "Login"
                                    }
                                    icon={<LogIn className="size-4" />}
                                    type="submit"
                                    className="w-full"
                                />
                            </form>
                        </div>
                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-500 dark:text-slate-500">
                                © 2024 SIGALUH. Semua hak dilindungi.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
