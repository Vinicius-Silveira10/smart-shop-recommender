import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthService } from '../services/AuthService';
import { cartService } from '../services/cartService';
import { OrderService } from '../services/OrderService';
import {
    CreditCard, Truck, CheckCircle, ArrowLeft,
    ShieldCheck, ShoppingBag, MapPin, Loader2
} from 'lucide-react';

const CheckoutPage: React.FC = () => {
    const { cart, total, refreshCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [isProcessingSuccess, setIsProcessingSuccess] = useState(false);

    const [cep, setCep] = useState("");
    // 🚀 NOVIDADE: Estados para armazenar o endereço completo e controle de busca
    const [addressInfo, setAddressInfo] = useState<any>(null);
    const [searchingCep, setSearchingCep] = useState(false);

    const shippingFromCart = location.state?.shippingValue || 0;
    const finalTotal = total + shippingFromCart;

    const user = AuthService.getCurrentUser();
    const userId = user?.id || user?.user_id;

    useEffect(() => {
        if (!loading && !isProcessingSuccess && cart.length === 0) {
            navigate('/dashboard');
        }
    }, [cart, loading, navigate, isProcessingSuccess]);

    // 🚀 NOVIDADE: Efeito para buscar o endereço automaticamente via API ViaCEP
    useEffect(() => {
        const cleanCep = cep.replace(/\D/g, "");
        if (cleanCep.length === 8) {
            setSearchingCep(true);
            fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
                .then(res => res.json())
                .then(data => {
                    if (!data.erro) {
                        setAddressInfo(data);
                    } else {
                        alert("CEP não encontrado.");
                        setAddressInfo(null);
                    }
                })
                .catch(() => alert("Erro ao buscar CEP."))
                .finally(() => setSearchingCep(false));
        } else {
            setAddressInfo(null);
        }
    }, [cep]);

    const handlePlaceOrder = async () => {
        if (!userId) return alert("Sessão expirada. Faça login novamente.");
        if (cart.length === 0) return alert("Seu carrinho está vazio.");

        const cleanCep = cep.replace(/\D/g, "");
        if (cleanCep.length !== 8 || !addressInfo) {
            return alert("Por favor, informe um CEP válido para carregar o endereço de entrega.");
        }

        setLoading(true);
        try {
            await OrderService.checkout(
                Number(userId),
                cart,
                total,
                cleanCep,
                shippingFromCart
            );

            setIsProcessingSuccess(true);

            try {
                await cartService.clearCart(Number(userId));
            } catch (e) {
                console.warn("Erro na limpeza do Node.");
            }

            await refreshCart();

            // 🚀 MUDANÇA: Agora enviamos a string formatada com os dados da API
            const fullAddressString = `${addressInfo.logradouro}, ${addressInfo.bairro} - ${addressInfo.localidade}/${addressInfo.uf}`;

            navigate('/checkout-success', {
                state: {
                    address: fullAddressString, // Enviando endereço completo para a próxima tela
                    days: 3,
                    price: shippingFromCart
                }
            });

        } catch (err: any) {
            console.error("Erro no Checkout:", err);
            alert("Houve um erro ao finalizar sua compra.");
            setIsProcessingSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-500 font-bold mb-10 hover:text-[#3f3bb1] transition-colors uppercase text-xs tracking-widest"
                >
                    <ArrowLeft size={16} /> Voltar para a Loja
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">

                        <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black uppercase italic mb-6 flex items-center gap-3">
                                <Truck className="text-[#3f3bb1]" /> Dados de Entrega
                            </h2>
                            <div className="space-y-6">
                                <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                                    <p className="text-sm font-black text-gray-700">Responsável pelo Recebimento</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Nome: <span className="text-[#3f3bb1] font-bold">{user?.username}</span>
                                    </p>
                                </div>

                                <div className="p-6 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">
                                        <MapPin size={14} className="text-[#3f3bb1]" /> Digite seu CEP para finalizar
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            maxLength={9}
                                            placeholder="00000-000"
                                            value={cep}
                                            onChange={(e) => setCep(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-black text-lg text-gray-700 focus:ring-2 focus:ring-[#3f3bb1]/20 outline-none transition-all"
                                        />
                                        {searchingCep && <Loader2 className="absolute right-4 top-4 animate-spin text-[#3f3bb1]" />}
                                    </div>

                                    {/* 🚀 NOVIDADE: Visualização do endereço confirmando que foi encontrado */}
                                    {addressInfo && (
                                        <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-top-2">
                                            <p className="text-xs font-bold text-green-700 uppercase tracking-tight">Endereço Encontrado:</p>
                                            <p className="text-sm font-black text-gray-800 mt-1">
                                                {addressInfo.logradouro}, {addressInfo.bairro}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {addressInfo.localidade} - {addressInfo.uf}
                                            </p>
                                        </div>
                                    )}

                                    <p className="text-[9px] text-gray-400 mt-3 uppercase font-bold italic">
                                        * A SmartShop preenche o endereço automaticamente através do CEP.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ... (Seção de Pagamento permanece igual) */}
                        <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black uppercase italic mb-6 flex items-center gap-3">
                                <CreditCard className="text-[#3f3bb1]" /> Método de Pagamento
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-6 border-2 border-[#3f3bb1] bg-indigo-50 rounded-[30px] flex items-center gap-4 relative overflow-hidden">
                                    <div className="bg-[#3f3bb1] p-3 rounded-2xl text-white shadow-lg">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-tight">Cartão Virtual Smart</p>
                                        <p className="text-[10px] text-gray-400 font-bold">**** **** **** 2026</p>
                                    </div>
                                    <ShieldCheck className="absolute -right-2 -bottom-2 text-indigo-100" size={60} />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* ... (Resumo Financeiro permanece igual) */}
                    <div className="h-fit sticky top-10">
                        <div className="bg-white p-10 rounded-[45px] shadow-2xl border border-gray-100">
                            <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-2">
                                <ShoppingBag className="text-[#3f3bb1]" size={20} /> Seu Pedido
                            </h3>

                            <div className="space-y-4 mb-10 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-gray-800 line-clamp-1">{item.product.name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold italic uppercase">Qtd: {item.quantity}</span>
                                        </div>
                                        <span className="text-sm font-black text-[#3f3bb1]">
                                            R$ {(Number(item.product.price) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-6 space-y-3 mb-8">
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>R$ {total.toFixed(2)}</span>
                                </div>
                                <div className={`flex justify-between text-xs font-bold uppercase tracking-widest ${shippingFromCart > 0 ? 'text-gray-400' : 'text-green-500'}`}>
                                    <span>Frete Smart</span>
                                    <span>{shippingFromCart > 0 ? `R$ ${shippingFromCart.toFixed(2)}` : 'Grátis'}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <span className="text-lg font-black uppercase italic tracking-tighter">Total</span>
                                    <span className="text-3xl font-black text-[#3f3bb1] tracking-tighter">
                                        R$ {finalTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                disabled={loading || cart.length === 0 || !addressInfo}
                                onClick={handlePlaceOrder}
                                className="w-full py-5 bg-[#3f3bb1] text-white rounded-[25px] font-black uppercase tracking-widest hover:bg-[#332f91] transition-all shadow-xl shadow-indigo-100 disabled:bg-gray-200 active:scale-95 flex justify-center items-center gap-2"
                            >
                                {loading ? "Processando..." : "Confirmar Compra"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;