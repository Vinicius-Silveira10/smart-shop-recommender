import { useEffect, useState } from 'react';
import { productService } from '../services/api';
import type {Product, User} from '../types';
import { ProductCard } from '../components/ProductCard';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Recupera o usuário logado
    const user: User = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (!user.id) return;
        setLoading(true);
        try {
            // Tenta buscar recomendações personalizadas primeiro
            console.log(`Buscando recomendações para usuário ${user.id}...`);
            let data = await productService.getRecommendations(user.id);

            // Se não houver recomendações (ex: usuário novo ou erro no ML), busca todos
            if (data.length === 0) {
                console.log("Sem recomendações, buscando produtos gerais...");
                data = await productService.getAllProducts();
            }

            setProducts(data);
        } catch (error) {
            console.error("Falha ao carregar vitrine", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (product: Product) => {
        // 1. Envia feedback de 'view' (visualização) para o Java
        productService.sendInteraction({
            userId: user.id,
            productId: product.id,
            actionType: 'view'
        });

        // Aqui você poderia navegar para uma tela de detalhes: navigate(`/product/${product.id}`)
        alert(`Você clicou em: ${product.name}. Interação 'view' enviada!`);
    };

    const handleAddToCart = (product: Product) => {
        // 1. Envia feedback de 'add_to_cart' para o Java
        productService.sendInteraction({
            userId: user.id,
            productId: product.id,
            actionType: 'add_to_cart'
        });
        alert(`Adicionado ao carrinho: ${product.name}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-blue-600">Smart Recommender</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 text-sm">Olá, <strong>{user.username}</strong></span>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-500 hover:text-red-600 transition"
                            title="Sair"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Recomendados para Você</h2>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Carregando recomendações...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={handleProductClick}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">Nenhum produto encontrado.</p>
                    </div>
                )}
            </main>
        </div>
    );
}