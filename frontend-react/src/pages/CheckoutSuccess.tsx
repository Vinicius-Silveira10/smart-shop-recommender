import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, MapPin, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
const CheckoutSuccess: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        address = "Endereço não identificado",
        days = 5,
        price = 0
    } = (location.state as any) || {};

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">

                {/* Cabeçalho */}
                <div className="bg-[#3f3bb1] p-12 text-center relative overflow-hidden">
                    <div className="relative z-10 animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                            <CheckCircle size={48} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                            Pedido Confirmado!
                        </h1>
                        <p className="text-indigo-100 font-medium mt-2 text-lg">
                            Obrigado pela sua compra!
                        </p>
                    </div>
                    <Package className="absolute -right-8 -bottom-8 text-white/10" size={200} />
                </div>

                <div className="p-10 space-y-10">
                    {/* Seção de Endereço com Fonte Aumentada */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#3f3bb1]">
                            <MapPin size={22} className="animate-bounce" />
                            <span className="text-[12px] font-black uppercase tracking-[0.2em]">Onde vamos entregar:</span>
                        </div>

                        {/* 🚀 MUDANÇA: Fonte aumentada de text-sm para text-xl e contraste reforçado */}
                        <div className="p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-xl md:text-2xl text-slate-800 font-black leading-tight tracking-tight">
                                {address}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#3f3bb1]">
                                <Package size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Previsão</span>
                            </div>
                            <p className="text-lg text-gray-900 font-black">
                                {days} {days === 1 ? 'dia útil' : 'dias úteis'}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#3f3bb1]">
                                <Truck size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Custo do Frete</span>
                            </div>
                            <p className="text-lg text-green-600 font-black italic uppercase">
                                {Number(price) === 0 ? "Grátis (Promoção)" : `R$ ${Number(price).toFixed(2)}`}
                            </p>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-gray-900 text-white px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                        >
                            Continuar Shopping <ArrowRight size={18} />
                        </button>

                        <button
                            onClick={() => navigate('/orders')}
                            className="flex-1 bg-white text-[#3f3bb1] border-2 border-[#3f3bb1] px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            <ShoppingBag size={18} /> Meus Pedidos
                        </button>
                    </div>
                </div>

                <footer className="bg-gray-50 p-6 text-center">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">
                        PEDIDO #SR-{Math.floor(Math.random() * 90000) + 10000}
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default CheckoutSuccess;