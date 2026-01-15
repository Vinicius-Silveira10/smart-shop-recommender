import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
// CORREÇÃO TS2339 e TS1484: Usando 'items' e importação de tipo
import { useCart, type CartItem } from '../context/CartContext';
// CORREÇÃO TS2307: Substituindo apiService pelos serviços modulares
import { OrderService } from '../services/OrderService';
import { IAService } from '../services/IAService';

export const CheckoutButton = () => {
    // RESOLVE TS2339: O contexto usa 'items', não 'cart'
    const { items, totalValue, clearCart } = useCart();
    const [isPending, setIsPending] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.user_id || user.id;

    const handleCheckout = async () => {
        if (items.length === 0) return;

        setIsPending(true);
        try {
            // 1. Envia o pedido para o Java/PostgreSQL
            const result = await OrderService.checkout(userId, items, totalValue);

            if (result) {
                // 2. Notifica a IA (Python) sobre a conversão de compra
                // RESOLVE TS7006: Tipando explicitamente o item como CartItem
                for (const item of items as CartItem[]) {
                    await IAService.logInteraction(userId, item.id, 'purchase');
                }

                alert("Pedido confirmado com sucesso!");
                clearCart();
            }
        } catch (error) {
            console.error("Erro no checkout:", error);
            alert("Falha ao processar o pedido. Verifique os serviços Java e Python.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={isPending || items.length === 0}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-lg flex justify-center items-center gap-2 transition-all active:scale-95 ${
                isPending ? 'bg-gray-400' : 'bg-[#3f3bb1] hover:bg-[#332f91]'
            }`}
        >
            {isPending ? (
                <Loader2 className="animate-spin" size={20} />
            ) : (
                <CreditCard size={20} />
            )}
            {isPending ? "PROCESSANDO..." : `FINALIZAR R$ ${totalValue.toLocaleString('pt-BR')}`}
        </button>
    );
};