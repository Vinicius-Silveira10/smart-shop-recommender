import React, { useEffect, useState, useCallback } from 'react';
import {
    Sparkles, ShoppingCart, Search, X, Menu, LogOut
} from 'lucide-react';
// import { useNavigate } from 'react-router-dom'; // Removido pois não estava sendo usado

// Serviços e Componentes
import { AuthService } from '../services/AuthService';
import { IAService } from '../services/IAService';
import { ProductService } from '../services/ProductService';
import RecommendationGrid from '../components/RecommendationGrid';
import CartSidebar from '../components/CartSidebar';
import NavigationSidebar from '../components/NavigationSidebar';
import { AdvancedFilterSidebar } from '../components/AdvancedFilterSidebar';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

/**
 * 🛠️ CORREÇÃO: Definição da Interface DashboardProps.
 * Resolve o erro "Property 'onLogout' does not exist" no App.tsx.
 */
interface DashboardProps {
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    // const navigate = useNavigate(); // Removido para limpar avisos de compilação
    const { cart, addToCart } = useCart();
    const cartCount = cart?.length || 0;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<{ type: 'search' | 'category' | 'advanced', value: string } | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const user = AuthService.getCurrentUser();
    const userId = user?.id || user?.user_id;

    const categories = [
        { id: 'all', label: 'Sugestões IA', icon: <Sparkles size={16} /> },
        { id: 'Computadores', label: 'Computadores' },
        { id: 'Periféricos', label: 'Periféricos' },
        { id: 'Smartphones', label: 'Smartphones' },
        { id: 'Roupas', label: 'Roupas' }
    ];

    const loadRecommendations = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setActiveFilter(null);
        setSearchQuery("");
        try {
            const recData = await IAService.getRecommendations(userId);
            if (recData?.results?.length > 0) {
                const hydrated = await Promise.all(
                    recData.results.map((r: any) => ProductService.getById(r.product_id))
                );
                setProducts(hydrated.filter(p => p !== null));
            } else {
                const allProducts = await ProductService.getAll();
                setProducts(allProducts || []);
            }
        } catch (err) {
            const fallback = await ProductService.getAll();
            setProducts(fallback || []);
        }
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length >= 3) {
                setLoading(true);
                setActiveFilter({ type: 'search', value: searchQuery });
                const results = await ProductService.getFiltered({ name: searchQuery });
                setProducts(results || []);
                setLoading(false);
            } else if (searchQuery.length === 0 && activeFilter?.type === 'search') {
                loadRecommendations();
            }
        }, 600);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, loadRecommendations, activeFilter]);

    const handleCategoryFilter = async (categoryId: string) => {
        if (categoryId === 'all') { loadRecommendations(); return; }

        setLoading(true);
        setSearchQuery("");
        setActiveFilter({ type: 'category', value: categoryId });

        let dbCategory = categoryId;
        if (categoryId === 'Roupas') dbCategory = 'Roupas';

        try {
            const filtered = await ProductService.getFiltered({ category: dbCategory });
            setProducts(filtered || []);
        } catch (err) {
            console.error(err);
            setProducts([]);
        }
        setLoading(false);
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        if (userId) ProductService.trackInteraction(userId, product.id, 'view');
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        setIsCartOpen(true);
        setSelectedProduct(null);
        if (userId) ProductService.trackInteraction(userId, product.id, 'add_to_cart');
    };

    useEffect(() => {
        if (userId) loadRecommendations();
    }, [userId, loadRecommendations]);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden">
            <NavigationSidebar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

            <aside className="w-80 bg-white border-r border-gray-100 hidden lg:block overflow-y-auto h-screen sticky top-0">
                <AdvancedFilterSidebar
                    currentCategory={activeFilter?.type === 'category' ? activeFilter.value : 'all'}
                    /** * 🛠️ CORREÇÃO: Adicionado tipo 'any' ao parâmetro filters.
                     * Resolve o erro de tipo implícito 'any'.
                     */
                    onFilterChange={async (filters: any) => {
                        setLoading(true);
                        const results = await ProductService.getFiltered(filters);
                        setProducts(results || []);
                        setLoading(false);
                    }}
                />
            </aside>

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="flex justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setIsNavOpen(true)} className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 text-[#3f3bb1]">
                            <Menu size={22} />
                        </button>
                        <div onClick={() => handleCategoryFilter('all')} className="text-2xl font-black text-[#3f3bb1] tracking-tighter cursor-pointer italic">
                            SMART<span className="text-gray-900">SHOP</span>
                        </div>
                    </div>

                    <div className="flex-1 max-w-lg hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar produtos inteligente..."
                                className="w-full pl-12 pr-12 py-3 bg-white rounded-2xl border-none shadow-sm outline-none font-medium text-sm focus:ring-2 focus:ring-[#3f3bb1]/20 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-white rounded-xl shadow-sm text-gray-600 hover:bg-gray-50 transition-colors">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#3f3bb1] text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* 🛠️ INTEGRAÇÃO: Botão de Logout adicionado ao cabeçalho. */}
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                            title="Sair da Conta"
                        >
                            <LogOut size={20} />
                            <span className="text-xs font-black uppercase hidden lg:block">Sair</span>
                        </button>
                    </div>
                </header>

                <section className="bg-[#3f3bb1] rounded-[40px] p-10 text-white mb-8 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter italic">Olá, {user?.username || 'Vinícius'}!</h2>
                        <p className="text-white/90 font-bold text-lg">
                            {activeFilter ? `Mostrando: ${activeFilter.value}` : "Sugestões da IA para você agora."}
                        </p>
                    </div>
                    <Sparkles className="absolute right-10 top-1/2 -translate-y-1/2 text-white/10" size={160} />
                </section>

                <nav className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryFilter(cat.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm border-2 ${(activeFilter?.value === cat.id || (!activeFilter && cat.id === 'all'))
                                ? 'bg-[#3f3bb1] border-[#3f3bb1] text-white'
                                : 'bg-white border-transparent text-gray-500 hover:border-gray-200'
                                }`}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </nav>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-72 bg-gray-200 rounded-3xl" />)}
                    </div>
                ) : (
                    <RecommendationGrid
                        products={products}
                        userId={userId}
                        onProductClick={handleProductClick}
                    />
                )}
            </main>

            {/* Modal de Detalhes */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
                    <div className="bg-white rounded-[40px] p-10 max-w-4xl w-full relative shadow-2xl flex flex-col md:flex-row gap-10">
                        <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                            <X size={24} />
                        </button>
                        <div className="w-full md:w-1/2 bg-gray-50 rounded-3xl p-8 flex items-center justify-center">
                            <img src={selectedProduct.imageUrl ?? "https://placehold.co/400"} alt={selectedProduct.name} className="max-h-80 object-contain drop-shadow-2xl" />
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col">
                            <span className="text-[#3f3bb1] font-black uppercase text-[10px] mb-2 tracking-widest">{selectedProduct.category}</span>
                            <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">{selectedProduct.name}</h2>
                            <p className="text-gray-500 leading-relaxed mb-8 flex-1">{selectedProduct.description}</p>
                            <div className="mt-auto flex items-center justify-between gap-6 pt-6 border-t border-gray-100">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Preço</span>
                                    <span className="text-3xl font-black text-[#3f3bb1]">R$ {selectedProduct.price.toFixed(2)}</span>
                                </div>
                                <button onClick={() => handleAddToCart(selectedProduct)} className="flex-1 bg-[#3f3bb1] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#332f91] transition-all shadow-lg">
                                    Adicionar ao Carrinho
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
};

export default Dashboard;