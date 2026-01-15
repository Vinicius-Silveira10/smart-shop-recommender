import type { Product } from '../types';
import { ShoppingCart, Package } from 'lucide-react';

interface Props {
    product: Product;
    onClick: (product: Product) => void;
    onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onClick, onAddToCart }: Props) {
    // Formata o preço para Reais (R$) vindo do Double do Java
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(product.price || 0);

    return (
        <div
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer flex flex-col h-full group"
            onClick={() => onClick(product)}
        >
            {/* Imagem do Produto com fallback para quando o imageUrl for null */}
            <div className="h-52 overflow-hidden bg-gray-50 flex items-center justify-center p-6 relative">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex flex-col items-center text-gray-300">
                        <Package size={48} strokeWidth={1} />
                        <span className="text-[10px] mt-2 uppercase font-bold tracking-widest">Sem Imagem</span>
                    </div>
                )}

                {/* Badge de Categoria com o Roxo padrão */}
                <div className="absolute top-3 left-3">
                    <span className="bg-[#3f3bb1]/10 text-[#3f3bb1] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {product.category || 'Geral'}
                    </span>
                </div>
            </div>

            {/* Informações do Produto */}
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-extrabold text-gray-800 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-[#3f3bb1] transition-colors">
                    {product.name} {/* Mapeado corretamente para o JSON */}
                </h3>

                <p className="text-gray-500 text-sm mb-5 line-clamp-2 flex-1">
                    {product.description || "Este produto ainda não possui uma descrição detalhada cadastrada."}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Preço à vista</span>
                        <span className="text-xl font-black text-gray-900">
                            {formattedPrice}
                        </span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Evita abrir o modal de detalhes ao clicar no carrinho
                            onAddToCart(product);
                        }}
                        // Botão com a cor roxa padrão
                        className="p-3 bg-[#3f3bb1] text-white rounded-xl hover:bg-[#332f91] transition-all shadow-lg shadow-[#3f3bb1]/20 active:scale-95"
                        title="Adicionar ao Carrinho"
                    >
                        <ShoppingCart size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
}