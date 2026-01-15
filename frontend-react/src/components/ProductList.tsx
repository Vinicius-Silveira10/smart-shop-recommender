
import React, { useEffect, useState } from 'react';
import { ProductService } from '../services/ProductService';
import { AuthService } from '../services/AuthService';
import AddProductModal from './AddProductModal';
import { Pencil, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    category: string;
    brand?: string;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [user, setUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const { addToCart, setIsOpen, cart } = useCart();

    useEffect(() => {
        loadProducts();
        setUser(AuthService.getCurrentUser());
    }, []);

    const loadProducts = async () => {
        try {
            const data = await ProductService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    const handleProductSaved = () => {
        loadProducts();
        setSuccessMessage(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        setEditingProduct(null);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await ProductService.deleteProduct(id);
                loadProducts();
                setSuccessMessage('Product deleted successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (error) {
                console.error("Failed to delete product", error);
                alert("Failed to delete product");
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const isAdmin = user && user.role === 'ADMIN';

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Products Dashboard</h2>
                    <div className="flex gap-4">
                        {!isAdmin && (
                            <button
                                onClick={() => setIsOpen(true)}
                                className="relative p-2 text-gray-600 hover:text-indigo-600"
                            >
                                <ShoppingCart size={28} />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                        {cart.length}
                                    </span>
                                )}
                            </button>
                        )}
                        {isAdmin && (
                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    setIsModalOpen(true);
                                }}
                                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                + Add Product
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map(product => (
                        <div key={product.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
                            <div className="p-6 space-y-4 flex-grow">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                                    <div className="flex gap-2 mt-1">
                                        <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                                            {product.category}
                                        </span>
                                        {product.brand && (
                                            <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                                                {product.brand}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>

                                    {isAdmin ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                                title="Edit"
                                            >
                                                <Pencil size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                                title="Delete"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => addToCart(product.id)}
                                            className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
                                        >
                                            Add to Cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AddProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onProductSaved={handleProductSaved}
                productToEdit={editingProduct}
            />

            {successMessage && (
                <div className="fixed px-6 py-3 text-white bg-green-500 rounded-lg shadow-lg bottom-5 right-5 animate-bounce">
                    {successMessage}
                </div>
            )}
        </div>
    );
};

export default ProductList;
