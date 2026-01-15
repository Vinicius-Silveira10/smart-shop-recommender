import React, { useEffect, useState } from 'react';
import { apiClient, JAVA_API_URL } from '../services/BaseAPI';
import { AuthService } from '../services/AuthService';
import {
    Package, Truck, Calendar, ArrowLeft,
    Clock, CheckCircle, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderDetailsModal from '../components/OrderDetailsModal';

// Interface para aceitar a função de logout vinda do App.tsx
interface OrdersPageProps {
    onLogout?: () => void;
}

const OrdersPage: React.FC<OrdersPageProps> = ({ onLogout }) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const user = AuthService.getCurrentUser();
    const userId = user?.id || user?.user_id;
    const navigate = useNavigate();

    // Estilização dinâmica baseada no status vindo do Java
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return { label: 'Entregue', color: 'bg-green-100 text-green-600', icon: <CheckCircle size={12} /> };
            case 'SHIPPED':
                return { label: 'Em Transporte', color: 'bg-blue-100 text-blue-600', icon: <Truck size={12} /> };
            case 'PROCESSING':
                return { label: 'Processando', color: 'bg-amber-100 text-amber-600', icon: <Clock size={12} /> };
            default:
                return { label: 'Confirmado', color: 'bg-indigo-100 text-[#3f3bb1]', icon: <Truck size={12} /> };
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                // Chamada ao Java (8083). O BaseAPI adiciona /api automaticamente.
                const res = await apiClient(JAVA_API_URL, `/orders/user/${userId}`);

                if (!res.ok) throw new Error("Erro ao carregar histórico");

                const data = await res.json();

                // Tratamento de dados para suportar listas diretas ou paginação do Spring
                const ordersList = Array.isArray(data) ? data : (data.content || []);

                // Ordenação priorizando 'order_date' (snake_case) vinda do @JsonProperty do Java
                const sortedOrders = [...ordersList].sort((a: any, b: any) => {
                    const dateA = new Date(a.order_date || a.orderDate || 0).getTime();
                    const dateB = new Date(b.order_date || b.orderDate || 0).getTime();
                    return dateB - dateA;
                });

                setOrders(sortedOrders);
            } catch (err) {
                console.error("Erro ao buscar pedidos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                        Meus <span className="text-[#3f3bb1]">Pedidos</span>
                    </h1>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-[#3f3bb1] transition-all"
                        >
                            <ArrowLeft size={16} /> Voltar à Loja
                        </button>

                        {onLogout && (
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 text-xs font-bold uppercase text-red-400 hover:text-red-600 transition-all border-l pl-4"
                            >
                                <LogOut size={16} /> Sair
                            </button>
                        )}
                    </div>
                </header>

                {loading ? (
                    <div className="text-center p-20">
                        <p className="animate-pulse text-gray-400 font-black uppercase italic tracking-widest">
                            Sincronizando com SmartShop Java...
                        </p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-100 shadow-sm">
                        <Package size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold uppercase italic tracking-widest">Nenhum pedido encontrado.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mt-6 text-[10px] bg-[#3f3bb1] text-white px-6 py-3 rounded-full font-black uppercase"
                        >
                            Ir para as compras
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => {
                            const statusInfo = getStatusStyle(order.status);
                            const rawDate = order.order_date || order.orderDate;

                            return (
                                <div
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all group"
                                >
                                    <div className="flex gap-6 items-center">
                                        <div className="p-4 bg-indigo-50 rounded-2xl text-[#3f3bb1] group-hover:bg-[#3f3bb1] group-hover:text-white transition-colors">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black text-sm uppercase text-gray-900">Pedido #{order.id}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase italic flex items-center gap-1">
                                                <Calendar size={12} />
                                                {rawDate ? new Date(rawDate).toLocaleDateString('pt-BR') : "Data Pendente"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:items-end gap-2">
                                        <span className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest flex items-center gap-1 ${statusInfo.color}`}>
                                            {statusInfo.icon} {statusInfo.label}
                                        </span>
                                        <p className="text-[9px] text-indigo-300 font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                            Clique para detalhes
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {selectedOrder && (
                <OrderDetailsModal
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    order={selectedOrder}
                />
            )}
        </div>
    );
};

export default OrdersPage;