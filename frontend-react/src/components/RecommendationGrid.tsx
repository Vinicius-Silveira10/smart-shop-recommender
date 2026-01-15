import React from 'react';
import type { Product } from '../types';
import { ShoppingCart, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductService } from '../services/ProductService';

interface RecommendationGridProps {
    products: Product[];
    userId: number;
    onProductClick: (product: Product) => void;
    onCategoryClick?: (category: string) => void;
}

const RecommendationGrid: React.FC<RecommendationGridProps> = ({
    products,
    userId,
    onProductClick,
    onCategoryClick
}) => {
    const { addToCart } = useCart();

    /**
     * CORREÇÃO CRÍTICA 1: Proteção contra erro de renderização.
     * Verifica se 'products' é realmente um Array antes de qualquer lógica.
     * Isso impede o crash "map is not a function".
     */
    if (!Array.isArray(products) || products.length === 0) {
        return (
            <div className="col-span-full py-20 text-center flex flex-col items-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <Package size={48} className="text-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-400">Nenhum produto encontrado</h3>
                <p className="text-gray-300 text-sm">Tente ajustar seus filtros ou busca.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
                    onClick={() => onProductClick(product)}
                >
                    {/* Imagem do Produto */}
                    <div className="h-48 bg-gray-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden p-4">
                        <img
                            src={product.imageUrl || "https://placehold.co/300x300/3f3bb1/ffffff?text=Sem+Imagem"}
                            alt={product.name}
                            className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-black text-gray-800 line-clamp-2 leading-tight mb-2">{product.name}</h3>

                        {/* Badge de Categoria */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCategoryClick?.(product.category);
                            }}
                            className="text-[9px] text-[#3f3bb1] font-black uppercase bg-indigo-50 px-3 py-1 rounded-lg hover:bg-[#3f3bb1] hover:text-white transition-all"
                        >
                            {product.category}
                        </button>
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-400 font-bold uppercase">Preço</span>
                            <span className="text-lg font-black text-gray-900">
                                {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                /**
                                 * CORREÇÃO 2: Sincronia com CartContext.
                                 * O context agora espera o objeto 'product' completo.
                                 */
                                addToCart(product);

                                // Registra a interação no Java (8083) via Gateway (8082)
                                if (userId) {
                                    ProductService.trackInteraction(userId, product.id, 'add_to_cart');
                                }
                            }}
                            className="p-3 bg-[#3f3bb1] text-white rounded-xl hover:bg-[#332f91] transition-all shadow-lg shadow-[#3f3bb1]/20 active:scale-95"
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecommendationGrid;