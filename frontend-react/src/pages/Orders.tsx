import React, { useEffect, useState } from 'react';
import {
    Package, RefreshCcw, ChevronLeft, ShoppingBag,
    Warehouse, Truck, CheckCircle, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../services/ProductService';
import { useCart } from '../context/CartContext';

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart(); const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.user_id || user.id;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Recupera os pedidos que já vêm com o campo 'status' calculado pelo Java
                const data = await ProductService.getUserOrders(userId);
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erro ao carregar pedidos:", error);
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchOrders();
    }, [userId]);

    /**
     * 🕒 LÓGICA DO STEPPER: Mapeia o texto do Java para um nível numérico
     * Sincronizado com a lógica de tempo do ProductService.java
     */
    const getStepLevel = (status: string) => {
        switch (status) {
            case "Pagamento Confirmado": return 1;
            case "Em Separação": return 2;
            case "Em Rota de Entrega (Fortaleza)": return 3;
            case "Entregue": return 4;
            default: return 1;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-[#3f3bb1] font-black uppercase text-[10px] mb-8 hover:opacity-70 transition-all tracking-widest"
            >
                <ChevronLeft size={18} /> Voltar ao Shopping
            </button>

            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-gray-900 mb-10 uppercase italic tracking-tighter flex items-center gap-4">
                    <ShoppingBag className="text-[#3f3bb1]" size={36} /> Meus Pedidos
                </h1>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2].map(i => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-[40px]" />)}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-20 text-center border-4 border-dashed border-gray-100">
                        <Package size={64} className="mx-auto text-gray-200 mb-6" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Nenhum pedido encontrado.</p>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {orders.map((item, idx) => {
                            const stepLevel = getStepLevel(item.status);

                            return (
                                <div key={`${item.id}-${idx}`} className="bg-white p-8 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                                    {/* Info do Produto */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-contain rounded-3xl bg-gray-50 p-4 border border-gray-100" />
                                                <div className="absolute -top-2 -right-2 bg-white shadow-md p-1.5 rounded-full border border-gray-50">
                                                    <Clock size={14} className="text-[#3f3bb1]" />
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{item.brand}</span>
                                                <h3 className="font-black text-gray-900 text-xl leading-tight">{item.name}</h3>
                                                <p className="text-[#3f3bb1] font-black text-2xl italic mt-1">
                                                    R$ {Number(item.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => { addToCart(item); navigate('/dashboard'); }}
                                            className="flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#3f3bb1] transition-all active:scale-95"
                                        >
                                            <RefreshCcw size={16} /> Comprar Novamente
                                        </button>
                                    </div>

                                    {/* --- BARRA DE PROGRESSO VISUAL --- */}
                                    <div className="pt-8 border-t border-gray-50">
                                        <div className="relative flex justify-between items-center max-w-2xl mx-auto mb-4">
                                            {/* Linha de Fundo */}
                                            <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 rounded-full" />

                                            {/* Linha Ativa (Progresso) */}
                                            <div
                                                className="absolute top-5 left-0 h-1 bg-[#3f3bb1] rounded-full transition-all duration-1000 ease-in-out"
                                                style={{ width: `${((stepLevel - 1) / 3) * 100}%` }}
                                            />

                                            {/* Ícones dos Estágios */}
                                            {[
                                                { label: 'Pedido', icon: <Package size={16} /> },
                                                { label: 'Separação', icon: <Warehouse size={16} /> },
                                                { label: 'Em Rota', icon: <Truck size={16} /> },
                                                { label: 'Entregue', icon: <CheckCircle size={16} /> }
                                            ].map((step, sIdx) => (
                                                <div key={sIdx} className="relative z-10 flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${sIdx + 1 <= stepLevel
                                                            ? 'bg-[#3f3bb1] border-[#3f3bb1] text-white shadow-lg shadow-[#3f3bb1]/20'
                                                            : 'bg-white border-gray-200 text-gray-300'
                                                        }`}>
                                                        {step.icon}
                                                    </div>
                                                    <p className={`text-[8px] font-black uppercase mt-3 tracking-tighter ${sIdx + 1 <= stepLevel ? 'text-[#3f3bb1]' : 'text-gray-300'
                                                        }`}>
                                                        {step.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tag de Status */}
                                        <div className="mt-8 bg-indigo-50/50 rounded-2xl p-4 text-center">
                                            <p className="text-[10px] font-black text-[#3f3bb1] uppercase tracking-[0.2em]">
                                                Status Atual: <span className="text-gray-900 ml-1">{item.status}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;