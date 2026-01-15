import React from 'react';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';

interface OrderSuccessProps {
    isOpen: boolean;
    onClose: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3f3bb1]/20 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md p-10 rounded-[40px] shadow-2xl text-center scale-in-center animate-in zoom-in-95 duration-300 border border-gray-100">
                {/* Ícone Animado */}
                <div className="relative mx-auto w-24 h-24 mb-8">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                    <div className="relative flex items-center justify-center w-full h-full bg-green-50 rounded-full">
                        <CheckCircle size={48} className="text-green-500" />
                    </div>
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
                    Pedido Confirmado!
                </h2>
                <p className="text-gray-500 font-medium mb-10 leading-relaxed px-4">
                    Sua compra foi registrada no banco de dados e enviada para o nosso sistema de logística.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={onClose}
                        className="w-full bg-[#3f3bb1] text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#332f91] transition-all shadow-xl shadow-[#3f3bb1]/20 active:scale-95"
                    >
                        <ShoppingBag size={20} />
                        Continuar Comprando
                    </button>

                    <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#3f3bb1] transition-colors">
                        Ver Meus Pedidos <ArrowRight size={14} />
                    </button>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-center gap-2 text-gray-300">
                    <Package size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Smart Recommender System</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;