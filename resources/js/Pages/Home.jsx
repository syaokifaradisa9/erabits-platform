import { Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import CartModal from '@/Components/CartModal';
import AllItemsModal from '@/Components/AllItemsModal';
import LoginModal from '@/Components/LoginModal';
import SuccessModal from '@/Components/SuccessModal';

// Komponen untuk item dengan lazy loading gambar
function ItemCard({ item, onAddToCart, isMobile = false }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    // Fungsi untuk mendapatkan placeholder gambar berdasarkan nama item
    const getImagePlaceholder = () => {
        // Gunakan inisial nama item sebagai placeholder
        const initials = item.name ? item.name.charAt(0).toUpperCase() : '?';
        // Gunakan warna background berdasarkan karakter pertama
        const colors = [
            'bg-blue-100 text-blue-800',
            'bg-green-100 text-green-800',
            'bg-yellow-100 text-yellow-800',
            'bg-red-100 text-red-800',
            'bg-purple-100 text-purple-800',
            'bg-pink-100 text-pink-800',
            'bg-indigo-100 text-indigo-800',
            'bg-gray-100 text-gray-800',
        ];
        const colorIndex = item.name ? item.name.charCodeAt(0) % colors.length : 7;
        return (
            <div className={`w-full ${isMobile ? 'h-40' : 'h-48'} flex items-center justify-center ${colors[colorIndex]}`}>
                <span className={`text-4xl font-bold`}>{initials}</span>
            </div>
        );
    };

    return (
        <div className={`${isMobile ? 'flex-shrink-0 w-64' : ''} bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300`}>
            <div className="relative">
                {!imgLoaded && !imgError && (
                    <div className={`w-full ${isMobile ? 'h-40' : 'h-48'} flex items-center justify-center bg-gray-100 animate-pulse`}>
                        <svg className={`animate-spin h-8 w-8 text-gray-400 ${isMobile ? 'h-6 w-6' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
                {item.image_path && !imgError ? (
                    <img 
                        src={`/storage/${item.image_path}?t=${new Date().getTime()}`} 
                        alt={item.name} 
                        className={`w-full ${isMobile ? 'h-40' : 'h-48'} object-contain p-4 bg-gray-50 transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    // Tampilkan placeholder jika tidak ada gambar atau terjadi error
                    <div className={`w-full ${isMobile ? 'h-40' : 'h-48'} flex items-center justify-center bg-gray-50`}>
                        {getImagePlaceholder()}
                    </div>
                )}
            </div>
            <div className={isMobile ? "p-3" : "p-4"}>
                <h4 className={`font-bold ${isMobile ? 'text-lg' : 'text-lg'} mb-${isMobile ? '1' : '1'} text-gray-800 truncate`} title={item.name}>{item.name}</h4>
                <p className={`text-blue-600 font-semibold mb-${isMobile ? '2' : '2'}`}>Rp {item.price?.toLocaleString()}</p>
                <p className={`text-gray-600 text-sm mb-${isMobile ? '3' : '3'}`}>Pemeliharaan: {item.maintenance_count} kali</p>
                <button 
                    onClick={() => onAddToCart(item)}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300 ${isMobile ? 'text-sm' : ''}`}
                >
                    Tambah ke Keranjang
                </button>
            </div>
        </div>
    );
}

export default function Home({ serviceCategories, auth }) {
    // Ambil keranjang dari localStorage saat komponen dimuat
    const [cart, setCart] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });
    
    // State untuk form permintaan layanan
    const [serviceRequest, setServiceRequest] = useState({
        name: '',
        contact: '',
        service_type: '',
        description: ''
    });
    
    // State untuk status form
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);
    const [requestError, setRequestError] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategoryForModal, setSelectedCategoryForModal] = useState(null);
    const [showAllItemsModal, setShowAllItemsModal] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successModalMessage, setSuccessModalMessage] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedMaintenance, setSelectedMaintenance] = useState('');
    const [sortBy, setSortBy] = useState('name-asc');
    
    const addToCart = (item) => {
        setCart(prevCart => {
            // Cek apakah item sudah ada di keranjang
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            
            let newCart;
            if (existingItem) {
                // Jika sudah ada, tambah jumlahnya
                newCart = prevCart.map(cartItem => 
                    cartItem.id === item.id 
                        ? { ...cartItem, quantity: cartItem.quantity + 1 } 
                        : cartItem
                );
            } else {
                // Jika belum ada, tambahkan ke keranjang
                newCart = [...prevCart, { ...item, quantity: 1 }];
            }
            
            // Simpan ke localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(newCart));
            }
            
            return newCart;
        });
    };

    const updateQuantity = (itemId, newQuantity) => {
        setCart(prevCart => {
            const newCart = prevCart.map(item => 
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
            
            // Simpan ke localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(newCart));
            }
            
            return newCart;
        });
    };

    const removeItem = (itemId) => {
        setCart(prevCart => {
            const newCart = prevCart.filter(item => item.id !== itemId);
            
            // Simpan ke localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(newCart));
            }
            
            return newCart;
        });
    };

    const openCart = () => {
        setIsCartOpen(true);
    };

    const closeCart = () => {
        setIsCartOpen(false);
    };

    const handleCheckout = () => {
        if (auth.user) {
            // User is already logged in
            createOrder(null, 'Pesanan Anda berhasil dibuat dan akan segera diproses.');
        } else {
            // Guest user, open login modal
            localStorage.setItem('cartAfterLogin', JSON.stringify(cart));
            setIsLoginModalOpen(true);
        }
    };

    const handleLoginSuccess = () => {
        setIsLoginModalOpen(false);
        // Reload the page to get the new auth state and trigger the useEffect
        window.location.reload();
    };

    const closeSuccessModalAndRedirect = () => {
        setSuccessModalOpen(false);
        window.location.href = '/orders';
    };

    const createOrder = (cartData, alertMessage) => {
        const cartToProcess = cartData || cart;
        if (cartToProcess.length === 0) {
            return;
        }

        console.log('Creating order with cart:', cartToProcess);
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        const token = csrfToken ? csrfToken.getAttribute('content') : '';
        
        fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                items: cartToProcess,
                status: 'pending'
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Order creation response:', data);
            if (data.success) {
                clearCart();
                closeCart();
                setSuccessModalMessage(alertMessage || `Pesanan Anda (ID: #${data.order_id}) telah berhasil dibuat.`);
                setSuccessModalOpen(true);
            } else {
                alert('Terjadi kesalahan saat membuat pesanan: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error creating order:', error);
            alert('Terjadi kesalahan saat membuat pesanan: ' + error.message);
        });
    };

    // Fungsi untuk mengirim permintaan layanan
    const handleSubmitServiceRequest = async () => {
        // Validasi data
        if (!serviceRequest.name || !serviceRequest.contact || !serviceRequest.service_type || !serviceRequest.description) {
            setRequestError('Mohon lengkapi semua data');
            return;
        }
        
        setRequestLoading(true);
        setRequestError('');
        
        try {
            const response = await fetch('/api/service-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(serviceRequest)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                setRequestSuccess(true);
                // Reset form
                setServiceRequest({
                    name: '',
                    contact: '',
                    service_type: '',
                    description: ''
                });
            } else {
                setRequestError(result.message || 'Terjadi kesalahan saat mengirim permintaan');
            }
        } catch (error) {
            setRequestError('Koneksi error. Silakan coba lagi nanti');
        } finally {
            setRequestLoading(false);
            // Reset success message after 5 seconds
            setTimeout(() => {
                setRequestSuccess(false);
            }, 5000);
        }
    };
    
    // Fungsi untuk scroll ke formulir permintaan layanan
    const scrollToServiceRequest = () => {
        const serviceRequestElement = document.querySelector('.bg-gradient-to-r.from-blue-500.to-blue-700');
        if (serviceRequestElement) {
            serviceRequestElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Fungsi untuk mengosongkan keranjang
    const clearCart = () => {
        setCart([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cart');
        }
    };

    const openAllItemsModal = (category) => {
        setSelectedCategoryForModal(category);
        setShowAllItemsModal(true);
    };

    const closeAllItemsModal = () => {
        setShowAllItemsModal(false);
        setSelectedCategoryForModal(null);
    };

    // Filter and sort categories and items
    const filteredCategories = useMemo(() => {
        if (!serviceCategories) return [];

        return serviceCategories.map(category => {
            // Start with all items in the category
            let filteredItems = [...(category.items || [])];

            // 1. Filter by search term
            if (searchTerm) {
                filteredItems = filteredItems.filter(item => 
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // 2. Filter by price range
            if (priceRange.min) {
                filteredItems = filteredItems.filter(item => item.price >= parseFloat(priceRange.min));
            }
            if (priceRange.max) {
                filteredItems = filteredItems.filter(item => item.price <= parseFloat(priceRange.max));
            }

            // 3. Filter by maintenance count
            if (selectedMaintenance) {
                if (selectedMaintenance === '4') {
                    filteredItems = filteredItems.filter(item => item.maintenance_count >= 4);
                } else {
                    filteredItems = filteredItems.filter(item => item.maintenance_count == selectedMaintenance);
                }
            }

            // 4. Sort the filtered items
            switch (sortBy) {
                case 'price-asc':
                    filteredItems.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filteredItems.sort((a, b) => b.price - a.price);
                    break;
                case 'name-asc':
                default:
                    filteredItems.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }

            return {
                ...category,
                items: filteredItems
            };
        })
        // 5. Filter by selected category and ensure the category still has items after filtering
        .filter(category => {
            const matchesCategory = selectedCategory ? category.id.toString() === selectedCategory : true;
            return matchesCategory && category.items.length > 0;
        });

    }, [serviceCategories, searchTerm, selectedCategory, priceRange, selectedMaintenance, sortBy]);

    // Cegah loading state saat komponen mount
    useEffect(() => {
        setLoading(false);
    }, []);

    // Simpan keranjang ke localStorage saat nilai cart berubah
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cartAfterLogin');
        if (savedCart && auth.user) {
            const cartToCheckout = JSON.parse(savedCart);
            if (cartToCheckout.length > 0) {
                createOrder(cartToCheckout, 'Login berhasil! Pesanan Anda telah dibuat.');
            }
            localStorage.removeItem('cartAfterLogin');
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat halaman...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-blue-600">EraBits Platform</div>
                    <nav className="flex items-center space-x-4">
                        <div className="relative">
                            <button 
                                onClick={openCart}
                                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cart.reduce((total, item) => total + item.quantity, 0)}
                                    </span>
                                )}
                            </button>
                        </div>
                        {auth.user ? (
                            <div className="relative">
                                <Link href={'/dashboard'} className="flex items-center space-x-3 text-gray-700 hover:text-blue-600">
                                    <span className="font-semibold hidden sm:inline">{auth.user.name}</span>
                                    <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <Link 
                                href={'/auth/login'}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
                            >
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            {/* Cart Modal */}
            <CartModal 
                cart={cart}
                isOpen={isCartOpen}
                onClose={closeCart}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={handleCheckout}
            />

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            <SuccessModal 
                isOpen={successModalOpen}
                onClose={closeSuccessModalAndRedirect}
                title="Berhasil!"
                message={successModalMessage}
            />

            {/* All Items Modal */}
            <AllItemsModal 
                isOpen={showAllItemsModal}
                onClose={closeAllItemsModal}
                category={selectedCategoryForModal}
                onAddToCart={addToCart}
            />

            {/* Service Request Section - Before Hero */}


            {/* Hero Section */}
            <section className="py-8 md:py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                        Solusi Lengkap untuk Kebutuhan Fasyankes
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                        Platform terpadu untuk kebutuhan Pemeliharaan alat kesehatan dan sarana prasarana fasilitas kesehatan
                    </p>
                    <div className="mt-4">
                        <button 
                            onClick={scrollToServiceRequest}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 inline-block shadow-md"
                        >
                            Butuh Bantuan atau Perbaikan?
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Content with Sidebar */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Filters Sidebar */}
                    <aside className="w-full md:w-1/4 lg:w-1/5">
                        <div className="bg-white p-6 rounded-lg shadow-lg sticky top-16">
                            <h3 className="text-xl font-bold mb-6 border-b pb-3">Filter & Cari</h3>
                            <div className="flex flex-col gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cari Nama</label>
                                    <input
                                        type="text"
                                        placeholder="Cari produk..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">Semua Kategori</option>
                                        {serviceCategories && serviceCategories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Harga</label>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="number"
                                            placeholder="Harga Min"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Harga Max"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Jml. Pemeliharaan</label>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedMaintenance}
                                        onChange={(e) => setSelectedMaintenance(e.target.value)}
                                    >
                                        <option value="">Semua</option>
                                        <option value="0">0 Kali</option>
                                        <option value="1">1 Kali</option>
                                        <option value="2">2 Kali</option>
                                        <option value="3">3 Kali</option>
                                        <option value="4">4+ Kali</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="name-asc">Nama A-Z</option>
                                        <option value="price-asc">Harga Terendah</option>
                                        <option value="price-desc">Harga Tertinggi</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Items Content */}
                    <main className="w-full md:w-3/4 lg:w-4/5">
                        {filteredCategories && filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <div key={category.id} className="mb-12">
                                    <div className="flex items-center mb-6 border-b pb-3 justify-between">
                                        <div className="flex items-center">
                                            <div className="text-3xl mr-4">{category.icon}</div>
                                            <h3 className="text-2xl font-bold text-gray-800">{category.name}</h3>
                                        </div>
                                        <button
                                            onClick={() => openAllItemsModal(category)}
                                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-900 font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center border border-blue-300"
                                        >
                                            Lihat Semua
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    {category.items && category.items.length > 0 ? (
                                        <div className="mb-8">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {category.items.map((item) => (
                                                    <ItemCard 
                                                        key={item.id} 
                                                        item={item} 
                                                        onAddToCart={addToCart} 
                                                        isMobile={false} 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-8">Tidak ada item yang sesuai dengan filter Anda dalam kategori ini.</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white rounded-lg shadow-md">
                                <h3 className="text-2xl font-bold text-gray-700">Tidak Ditemukan</h3>
                                <p className="text-gray-500 mt-2">Tidak ada item yang cocok dengan kriteria filter Anda. Coba ubah filter Anda.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Service Request Section - Below Items Content */}
            <section className="py-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">Butuh Bantuan atau Perbaikan?</h2>
                            <p className="text-blue-100">Kirimkan permintaan layanan Anda, kami akan segera menanganinya</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-blue-100">Nama Lengkap</label>
                                <input
                                    type="text"
                                    placeholder="Nama Anda"
                                    value={serviceRequest.name}
                                    onChange={(e) => setServiceRequest({...serviceRequest, name: e.target.value})}
                                    className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-blue-200/50"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2 text-blue-100">Email atau Telepon</label>
                                <input
                                    type="text"
                                    placeholder="Kontak Anda"
                                    value={serviceRequest.contact}
                                    onChange={(e) => setServiceRequest({...serviceRequest, contact: e.target.value})}
                                    className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-blue-200/50"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2 text-blue-100">Jenis Layanan</label>
                                <select 
                                    value={serviceRequest.service_type}
                                    onChange={(e) => setServiceRequest({...serviceRequest, service_type: e.target.value})}
                                    className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-blue-200/50">
                                    <option value="">Pilih Jenis Layanan</option>
                                    <option value="perbaikan">Perbaikan Alat</option>
                                    <option value="konsultasi">Konsultasi Teknis</option>
                                    <option value="instalasi">Instalasi Baru</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-blue-100">Deskripsi Masalah</label>
                            <textarea
                                placeholder="Jelaskan masalah yang Anda alami atau layanan yang Anda butuhkan..."
                                rows="3"
                                value={serviceRequest.description}
                                onChange={(e) => setServiceRequest({...serviceRequest, description: e.target.value})}
                                className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-blue-200/50"
                            ></textarea>
                        </div>
                        
                        <div className="mb-4">
                            {requestError && (
                                <div className="text-red-300 bg-red-900/30 p-3 rounded-lg text-center mb-3">
                                    {requestError}
                                </div>
                            )}
                            {requestSuccess && (
                                <div className="text-green-300 bg-green-900/30 p-3 rounded-lg text-center mb-3">
                                    Permintaan layanan Anda telah terkirim! Kami akan segera menghubungi Anda.
                                </div>
                            )}
                        </div>
                        
                        <div className="text-center">
                            <button 
                                onClick={handleSubmitServiceRequest}
                                disabled={requestLoading}
                                className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300 inline-block disabled:opacity-50 shadow-md"
                            >
                                {requestLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengirim...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                        </svg>
                                        Kirim Permintaan Layanan
                                    </span>
                                )}
                            </button>
                        </div>
                        
                        <div className="mt-4 text-center text-sm text-blue-100/80">
                            <p>Tim teknisi kami akan segera menghubungi Anda setelah permintaan dikirim</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Keunggulan Kami</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="text-4xl mb-4">🔧</div>
                            <h3 className="text-xl font-bold mb-2">Pemeliharaan Profesional</h3>
                            <p className="text-gray-600">Tim teknisi berpengalaman untuk pemeliharaan alat kesehatan dan fasilitas</p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="text-4xl mb-4">🏥</div>
                            <h3 className="text-xl font-bold mb-2">Spesialis Fasyankes</h3>
                            <p className="text-gray-600">Fokus pada kebutuhan spesifik fasilitas kesehatan di Indonesia</p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="text-4xl mb-4">✅</div>
                            <h3 className="text-xl font-bold mb-2">Kualitas Terjamin</h3>
                            <p className="text-gray-600">Produk dan layanan yang memenuhi standar kesehatan nasional</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Siap untuk Menjelajahi Produk & Layanan Kami?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Buat akun atau masuk ke sistem untuk mengakses semua fitur kami
                    </p>
                    <div className="space-x-4">
                        <Link 
                            href="/auth/login"
                            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300 inline-block"
                        >
                            Masuk ke Akun
                        </Link>
                        <Link 
                            href="/auth/login"
                            className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300 inline-block"
                        >
                            Daftar Akun Baru
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>© {new Date().getFullYear()} EraBits Platform. Semua hak dilindungi.</p>
                </div>
            </footer>
        </div>
    );
}
