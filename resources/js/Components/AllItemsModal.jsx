import { useState, useEffect } from 'react';

function AllItemsModal({ isOpen, onClose, category, onAddToCart }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imgStates, setImgStates] = useState({});
    
    useEffect(() => {
        if (isOpen && category) {
            loadItems();
        }
    }, [isOpen, category]);
    
    const loadItems = async () => {
        if (!category) return;
        
        setLoading(true);
        try {
            const response = await fetch(`/api/service-categories/${category.id}/items`);
            const data = await response.json();
            
            if (response.ok) {
                setItems(data.items || []);
            } else {
                console.error('Error fetching items:', data.error);
                setItems([]);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleImageLoad = (itemId) => {
        setImgStates(prev => ({ ...prev, [itemId]: { loaded: true, error: false } }));
    };
    
    const handleImageError = (itemId) => {
        setImgStates(prev => ({ ...prev, [itemId]: { loaded: false, error: true } }));
    };

    // Fungsi untuk mendapatkan placeholder gambar berdasarkan nama item
    const getImagePlaceholder = (item) => {
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
            <div className="w-full h-48 flex items-center justify-center bg-gray-50">
                <div className={`${colors[colorIndex]} w-full h-full flex items-center justify-center`}>
                    <span className="text-5xl font-bold">{initials}</span>
                </div>
            </div>
        );
    };

    if (!isOpen || !category) return null;

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
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Semua {category.name}
                                    </h3>
                                    <button 
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {items && items.length > 0 ? items.map((item) => (
                                            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                                                <div className="relative">
                                                    {!imgStates[item.id]?.loaded && !imgStates[item.id]?.error && (
                                                        <div className="w-full h-48 flex items-center justify-center bg-gray-100 animate-pulse">
                                                            <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {item.image_path && !imgStates[item.id]?.error ? (
                                                        <img 
                                                            src={`/storage/${item.image_path}?t=${new Date().getTime()}`} 
                                                            alt={item.name} 
                                                            className={`w-full h-48 object-contain p-4 bg-gray-50 transition-opacity duration-300 ${imgStates[item.id]?.loaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                                                            onLoad={() => handleImageLoad(item.id)}
                                                            onError={() => {
                                                                handleImageError(item.id);
                                                            }}
                                                        />
                                                    ) : (
                                                        // Tampilkan placeholder jika tidak ada gambar atau terjadi error
                                                        getImagePlaceholder(item)
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-bold text-lg mb-2 text-gray-800 truncate" title={item.name}>{item.name}</h4>
                                                    <p className="text-blue-600 font-semibold mb-3">Rp {item.price?.toLocaleString()}</p>
                                                    <p className="text-gray-600 text-sm mb-4">Pemeliharaan: {item.maintenance_count} kali</p>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (onAddToCart && typeof onAddToCart === 'function') {
                                                                onAddToCart(item);
                                                            } else {
                                                                console.error('onAddToCart function is not available or not a function');
                                                            }
                                                            onClose();
                                                        }}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300"
                                                    >
                                                        Tambah ke Keranjang
                                                    </button>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="col-span-full text-center py-12">
                                                <p className="text-gray-600 text-lg">Tidak ada item dalam kategori ini.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllItemsModal;