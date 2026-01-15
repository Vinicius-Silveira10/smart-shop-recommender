import React, { useEffect, useState } from 'react';
import {
    X, Package, Tag, Hash, Truck, MapPin, CheckCircle2
} from 'lucide-react';
import { ProductService } from '../services/ProductService';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
    const [itemsWithDetails, setItemsWithDetails] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && order?.items) {
            const hydrateItems = async () => {
                setLoading(true);
                try {
                    const hydrated = await Promise.all(
                        order.items.map(async (item: any) => {
                            // 🚀 ALINHAMENTO JAVA: Captura o ID mapeado pelo Jackson (@JsonProperty)
                            // Priorizamos 'product_id' que é o padrão que definimos no backend.
                            const pId = item.product_id || item.productId || (item.product && item.product.id);

                            if (!pId) {
                                console.warn("⚠️ Item sem ID de produto. Limpe os testes antigos do banco.", item);
                                return { ...item, name: "Produto não identificado", price: 0 };
                            }

                            try {
                                // Busca os detalhes atuais (nome, imagem) no Java
                                const product = await ProductService.getById(pId);
                                // Mescla: mantém a quantidade/preço da compra e adiciona detalhes do produto
                                return { ...item, ...product };
                            } catch (err) {
                                console.error(`❌ Erro ao buscar produto ${pId}:`, err);
                                return item;
                            }
                        })
                    );
                    setItemsWithDetails(hydrated);
                } catch (err) {
                    console.error("Erro na hidratação dos itens:", err);
                } finally {
                    setLoading(false);
                }
            };
            hydrateItems();
        }
    }, [isOpen, order]);

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">

                {/* Cabeçalho */}
                <header className="bg-[#3f3bb1] p-8 text-white relative">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-white/20 p-3 rounded-2xl">
                            <Package size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">Detalhes do Pedido</h2>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">
                                ID: #{order.id} • {new Date(order.orderDate || order.order_date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-h-[50vh] overflow-y-auto">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-2">Itens do Pacote</p>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-[25px]" />)}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {itemsWithDetails.map((item, index) => {
                                // 💰 LÓGICA DE PREÇO: 
                                // 1. Tenta o preço gravado na compra (price_at_purchase)
                                // 2. Fallback para o preço atual do produto vindo do Java (priceAtPurchase ou price)
                                const unitPrice = Number(item.price_at_purchase || item.priceAtPurchase || item.price || 0);

                                return (
                                    <div key={index} className="flex items-center gap-5 p-5 bg-gray-50 rounded-[30px] border border-gray-100 transition-all hover:border-indigo-100 hover:bg-white hover:shadow-sm">
                                        <img
                                            src={item.imageUrl || item.image_url || "https://placehold.co/100x100?text=📦"}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-2xl shadow-sm bg-white"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-black text-gray-800 text-sm leading-tight">
                                                {item.name || "Carregando..."}
                                            </h4>
                                            <div className="flex gap-4 mt-2">
                                                <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                                                    <Hash size={12} className="text-[#3f3bb1]" /> Qtd: {item.quantity}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                                                    <Tag size={12} className="text-[#3f3bb1]" />
                                                    Unit: R$ {unitPrice.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-[#3f3bb1]">
                                                R$ {(item.quantity * unitPrice).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer - Resumo de Valores */}
                <footer className="p-10 bg-gray-50 border-t flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Truck size={16} />
                            <span className="text-[10px] font-black uppercase">Frete Grátis</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle2 size={16} />
                            <span className="text-[10px] font-black uppercase">{order.status || "Concluído"}</span>
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total do Pedido</p>
                        <p className="text-4xl font-black text-gray-900">
                            R$ {Number(order.totalAmount || order.total_amount || 0).toFixed(2)}
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default OrderDetailsModal;