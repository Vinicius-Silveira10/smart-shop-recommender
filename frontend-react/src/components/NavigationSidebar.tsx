import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingBag, X, LogOut, ChevronRight
} from 'lucide-react';
import { AuthService } from '../services/AuthService';

interface NavigationSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout(); // Limpa token e user do localStorage
        onClose();
        window.location.href = '/login'; // Reinicia o estado da aplicação
    };

    return (
        <>
            {/* Overlay para fechar ao clicar fora */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed left-0 top-0 h-full w-full max-w-xs bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">

                    {/* Header da Sidebar */}
                    <header className="p-8 flex justify-between items-center border-b border-gray-50">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#3f3bb1] rounded-lg flex items-center justify-center">
                                <LayoutDashboard size={18} className="text-white" />
                            </div>
                            <span className="font-black text-gray-900 tracking-tighter uppercase italic">Menu</span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                            <X size={20} />
                        </button>
                    </header>

                    {/* Links de Navegação */}
                    <nav className="p-6 flex-1 space-y-2 overflow-y-auto">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-4 tracking-widest">Navegação Principal</p>

                        <button
                            onClick={() => { navigate('/dashboard'); onClose(); }}
                            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-indigo-50 text-gray-600 hover:text-[#3f3bb1] transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <LayoutDashboard size={20} />
                                <span className="font-bold text-sm">Dashboard / Início</span>
                            </div>
                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
                        </button>

                        <button
                            onClick={() => { navigate('/orders'); onClose(); }}
                            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-indigo-50 text-gray-600 hover:text-[#3f3bb1] transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={20} />
                                <span className="font-bold text-sm">Meus Pedidos / Rastreio</span>
                            </div>
                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                    </nav>

                    {/* Rodapé com Logout */}
                    <footer className="p-6 border-t border-gray-50">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all shadow-sm"
                        >
                            <LogOut size={20} />
                            <span className="text-sm uppercase tracking-widest">Sair do SmartShop</span>
                        </button>
                    </footer>
                </div>
            </aside>
        </>
    );
};

export default NavigationSidebar;