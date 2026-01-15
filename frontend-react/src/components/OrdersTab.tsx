import React, { useEffect, useState } from 'react';
import { getUserPurchases } from '../services/apiService'; // Removido .ts para evitar erro de importação
import { ProductCard } from './ProductCard';
import { Package } from 'lucide-react';

interface OrdersTabProps {
    userId: number;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ userId }) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrders = async () => {
            // Se o login falhou ou o userId não chegou, não faz a chamada
            if (!userId) {
                console.warn("OrdersTab: Aguardando userId válido...");
                return;
            }

            setLoading(true);
            try {
                // Chama o endpoint: http://localhost:8082/api/products/orders/{userId}
                const data = await getUserPurchases(userId);

                // O Java retorna a lista de produtos comprados
                setOrders(data || []);
            } catch (error) {
                console.error("Erro ao carregar histórico de pedidos:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]); // Dispara a busca sempre que o usuário logar ou mudar

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3f3bb1]"></div>
            <p className="text-[#3f3bb1] font-bold animate-pulse">Sincronizando com o banco de dados...</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                    <Package className="text-[#3f3bb1]" size={28} />
                    Meus Pedidos
                </h2>
                <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {orders.length} {orders.length === 1 ? 'Item' : 'Itens'}
                </span>
            </header>

            {orders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* ADIÇÃO DE ': any' para resolver o erro TS7006 */}
                    {orders.map((product: any) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => {}} // Visualização apenas na aba de pedidos
                            onAddToCart={() => {}} // Desativado para evitar compras duplicadas acidentais
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Sua estante está vazia!</h3>
                    <p className="text-gray-400 max-w-xs mx-auto">
                        Você ainda não realizou nenhuma compra. Explore nossos eletrônicos e comece agora!
                    </p>
                </div>
            )}
        </div>
    );
};