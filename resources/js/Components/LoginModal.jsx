import { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onOpenRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch('/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onLoginSuccess(data.user);
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                    
                    <div className="mt-4 text-center text-sm border-t pt-4">
                        Belum punya akun?{' '}
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                if (onOpenRegister) {
                                    onOpenRegister();
                                }
                            }}
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Registrasi di sini
                        </button>
                        <span className="mx-2 text-gray-400">|</span>
                        <button
                            type="button"
                            onClick={onClose}
                            className="font-medium text-gray-600 hover:text-gray-800"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
