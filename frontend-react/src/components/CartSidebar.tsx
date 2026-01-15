import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, Truck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, total } = useCart();
    const navigate = useNavigate();

    const [cep, setCep] = useState('');
    const [shippingValue, setShippingValue] = useState(0);

    const user = AuthService.getCurrentUser();
    // Pega o ID independente se o campo veio como id ou user_id do banco
    const userId = user?.id || user?.user_id;

    // Cálculo dinâmico de frete informativo
    useEffect(() => {
        const cleanCep = cep.replace(/\D/g, "");
        if (cleanCep.length === 8) {
            let baseShipping = 25.00;
            // Regra simples: CEPs começando com 0 ou 6 (ex: SP/CE) têm desconto
            if (cleanCep.startsWith("0") || cleanCep.startsWith("6")) baseShipping = 15.00;
            else if (cleanCep.startsWith("2")) baseShipping = 20.00;

            // Seguro de 1% do valor da compra
            const insurance = total * 0.01;
            setShippingValue(baseShipping + insurance);
        } else {
            setShippingValue(0);
        }
    }, [cep, total]);

    /**
     * REDIRECIONAMENTO COM ESTADO:
     * Enviamos o valor do frete para que o CheckoutPage.tsx não precise calcular de novo,
     * evitando divergência de valores.
     */
    const handleCheckoutRedirect = () => {
        onClose();
        navigate('/checkout', {
            state: { shippingValue: shippingValue }
        });
    };

    if (!isOpen) return null;

    // Valor total real (Produtos + Frete) para exibição imediata
    const grandTotal = total + shippingValue;

    return (
        <div className="fixed inset-0 z-[150] overflow-hidden">
            {/* Overlay com Blur */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md">
                    <div className="h-full flex flex-col bg-white shadow-2xl">

                        {/* Header Premium */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-gray-900 italic uppercase tracking-tighter">
                                    Meu <span className="text-[#3f3bb1]">Carrinho</span>
                                </h2>
                                <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-full transition-all hover:rotate-90">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Lista de Itens com Scroll Customizado */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                            <ul className="divide-y divide-gray-100">
                                {cart.length === 0 ? (
                                    <div className="text-center py-20 flex flex-col items-center">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                            <ShoppingBag size={40} />
                                        </div>
                                        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">O carrinho está vazio</p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <li key={item.id} className="py-6 flex items-center gap-4">
                                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 p-2">
                                                <img
                                                    src={item.product?.imageUrl || "https://placehold.co/100"}
                                                    alt={item.product?.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between text-sm font-black text-gray-900">
                                                    <h3 className="line-clamp-1">{item.product?.name}</h3>
                                                    <p className="ml-4 text-[#3f3bb1]">
                                                        {(Number(item.product?.price || 0) * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </p>
                                                </div>
                                                <div className="flex-1 flex items-end justify-between text-[10px] mt-2 font-bold uppercase tracking-tighter">
                                                    <p className="text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">Qtd: {item.quantity}</p>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Trash2 size={12} /> Remover
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>

                            {/* Seção de Frete Inteligente */}
                            {cart.length > 0 && (
                                <div className="mt-10 p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                                    <label className="text-[10px] font-black text-[#3f3bb1] uppercase tracking-widest flex items-center gap-2 mb-3">
                                        <Truck size={14} /> Logística de Entrega
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Digite seu CEP (00000-000)"
                                        value={cep}
                                        onChange={(e) => setCep(e.target.value)}
                                        maxLength={9}
                                        className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl outline-none text-sm font-bold focus:ring-2 focus:ring-[#3f3bb1]/20 transition-all shadow-sm"
                                    />
                                    {shippingValue > 0 && (
                                        <p className="text-[10px] text-[#3f3bb1] font-bold mt-3 text-right animate-pulse">
                                            Frete calculado: R$ {shippingValue.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Rodapé Financeiro */}
                        <div className="border-t border-gray-100 p-8 bg-gray-50/80 backdrop-blur-md">
                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>

                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400">Frete Smart</span>
                                    {shippingValue > 0 ? (
                                        <span className="text-gray-900">{shippingValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                    ) : (
                                        <span className="text-green-500 font-black italic">Calculando...</span>
                                    )}
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <span className="text-xl font-black uppercase italic tracking-tighter">Total Geral</span>
                                    <span className="text-3xl font-black text-[#3f3bb1] tracking-tighter">
                                        {grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleCheckoutRedirect}
                                    disabled={cart.length === 0}
                                    className="w-full py-5 rounded-[25px] shadow-xl text-xs font-black uppercase tracking-widest text-white bg-[#3f3bb1] hover:bg-[#332f91] transition-all transform active:scale-95 disabled:bg-gray-200 flex justify-center items-center gap-2"
                                >
                                    Finalizar Pedido <ArrowRight size={18} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#3f3bb1] transition-colors py-2"
                                >
                                    Continuar Comprando
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;