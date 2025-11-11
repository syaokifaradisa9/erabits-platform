import { useState } from 'react';
import { router } from '@inertiajs/react';
import FormInput from '@/Components/forms/FormInput';
import Button from '@/Components/Buttons/Button';

export default function RegisterModal({ isOpen, onClose, onOpenLogin }) {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/auth/store', data, {
            onSuccess: () => {
                setProcessing(false);
                onClose();
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false)
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Buat Akun Baru
                                </h3>
                                
                                <form onSubmit={submit}>
                                    <div className="mb-4">
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
                                    
                                    <div className="mb-4">
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
                                    
                                    <div className="mb-4">
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
                                    
                                    <div className="mb-6">
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
                                    
                                    <div className="mt-6">
                                        <Button
                                            label="Daftar"
                                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            isLoading={processing}
                                            disabled={processing}
                                            type="submit"
                                        />
                                    </div>
                                    
                                    <div className="mt-4 text-center text-sm text-gray-600">
                                        Dengan mendaftar, Anda menyetujui syarat dan ketentuan layanan kami.
                                    </div>
                                </form>
                                
                                <div className="mt-4 text-center text-sm">
                                    Sudah punya akun?{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onClose();
                                            if (onOpenLogin) {
                                                onOpenLogin();
                                            }
                                        }}
                                        className="font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Masuk di sini
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}