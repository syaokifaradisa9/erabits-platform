import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FormInput from '@/Components/forms/FormInput';
import Button from '@/Components/Buttons/Button';

export default function Register() {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/auth/store', data, {
            onSuccess: () => setProcessing(false),
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Register" />
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Buat Akun Baru
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Atau{' '}
                        <Link
                            href="/auth/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            masuk ke akun Anda
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <FormInput
                                label="Nama Lengkap"
                                name="name"
                                type="text"
                                value={data.name}
                                error={errors.name}
                                onChange={(e) => setData({...data, name: e.target.value})}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="mt-4">
                            <FormInput
                                label="Email"
                                name="email"
                                type="email"
                                value={data.email}
                                error={errors.email}
                                onChange={(e) => setData({...data, email: e.target.value})}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <FormInput
                                label="Password"
                                name="password"
                                type="password"
                                value={data.password}
                                error={errors.password}
                                onChange={(e) => setData({...data, password: e.target.value})}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <FormInput
                                label="Konfirmasi Password"
                                name="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                error={errors.password_confirmation}
                                onChange={(e) => setData({...data, password_confirmation: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            label="Daftar"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            isLoading={processing}
                            disabled={processing}
                            type="submit"
                        />
                    </div>
                    
                    <div className="text-center text-sm text-gray-600">
                        Dengan mendaftar, Anda menyetujui syarat dan ketentuan layanan kami.
                    </div>
                </form>
            </div>
        </div>
    );
}