import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductService } from '../services/ProductService'; // Serviço de catálogo
import { IAService } from '../services/IAService'; // Serviço de inteligência

const ProductDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);

    // Recupera o utilizador do localStorage de forma segura
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.user_id || user.id;

    useEffect(() => {
        const loadProductData = async () => {
            if (id) {
                try {
                    // 1. Busca os detalhes reais do produto no PostgreSQL (Java)
                    const data = await ProductService.getById(Number(id));
                    setProduct(data);

                    // 2. Regista a visualização na IA (Python FastAPI) para futuras recomendações
                    if (userId) {
                        await IAService.logInteraction(userId, Number(id), 'view');
                    }
                } catch (error) {
                    console.error("Erro ao carregar o produto:", error);
                }
            }
        };

        loadProductData();
    }, [id, userId]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center font-black text-[#3f3bb1] bg-gray-50 animate-pulse">
                CARREGANDO DETALHES...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-8 font-black text-gray-400 hover:text-[#3f3bb1] uppercase text-xs tracking-widest transition-colors"
            >
                <ArrowLeft size={18} /> Voltar ao Painel
            </button>

            <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
                <div className="md:w-1/2 p-12 bg-white flex items-center justify-center border-r border-gray-50">
                    {/* Resiliência de imagem com fallback estável */}
                    <img
                        src={product.imageUrl || product.image_url || "https://placehold.co/500x500/3f3bb1/ffffff?text=Produto"}
                        alt={product.name}
                        className="max-h-[500px] w-full object-contain hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/500x500/eeeeee/999999?text=Imagem+Indisponivel"; }}
                    />
                </div>

                <div className="md:w-1/2 p-12 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <span className="bg-[#3f3bb1]/10 text-[#3f3bb1] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {product.category || 'Premium'}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-400 font-bold">
                            <Star size={16} fill="currentColor"/> 4.9
                        </div>
                    </div>

                    <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight">{product.name}</h1>

                    <div className="text-4xl font-black text-[#3f3bb1] mb-10">
                        {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>

                    <div className="flex-1 mb-12">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Especificações</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">{product.description || "Este produto premium foi selecionado pela nossa inteligência artificial para o seu perfil."}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="flex items-center gap-3 p-5 bg-gray-50 rounded-2xl text-gray-500">
                            <ShieldCheck size={24} className="text-green-500" />
                            <span className="text-[10px] font-black uppercase tracking-tighter leading-none">Garantia Oficial</span>
                        </div>
                        <div className="flex items-center gap-3 p-5 bg-gray-50 rounded-2xl text-gray-500">
                            <Truck size={24} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-tighter leading-none">Entrega Expressa</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            addToCart({ ...product, id: product.id || Number(id) });
                            // Regista no Python que o utilizador colocou no carrinho
                            IAService.logInteraction(userId, Number(id), 'cart');
                        }}
                        className="w-full bg-[#3f3bb1] text-white py-6 rounded-3xl font-black text-xl hover:bg-[#332f91] transition-all shadow-2xl shadow-[#3f3bb1]/30 active:scale-95 flex justify-center gap-3 items-center"
                    >
                        <ShoppingCart size={28} /> Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;