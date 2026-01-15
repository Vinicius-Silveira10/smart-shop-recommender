import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, LogOut, ShoppingBag, Search, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
    onSearch: (query: string) => void;
    onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onOpenCart }) => {
    const navigate = useNavigate();
    const { cart } = useCart();
    const cartCount = cart.length;
    const [searchTerm, setSearchTerm] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40 px-4 md:px-8 h-20 flex items-center justify-between gap-4 border-b border-gray-100">
            {/* Esquerda: Logo e Botões de Navegação */}
            <div className="flex items-center gap-6">
                <Link to="/dashboard" className="text-2xl font-black text-[#3f3bb1] tracking-tighter hidden lg:block italic">
                    SMART<span className="text-gray-900">SHOP</span>
                </Link>

                <nav className="flex items-center gap-2">
                    <Link title="Início" to="/dashboard" className="p-3 text-gray-400 hover:text-[#3f3bb1] hover:bg-indigo-50 rounded-2xl transition-all">
                        <Home size={22} />
                    </Link>

                    {/* BOTÃO QUE ESTÁ FALTANDO NA SUA IMAGEM */}
                    <Link
                        title="Meus Pedidos"
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-500 hover:text-[#3f3bb1] hover:bg-indigo-50 rounded-2xl transition-all group border border-transparent hover:border-[#3f3bb1]/20"
                    >
                        <ShoppingBag size={20} className="group-hover:animate-bounce" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block">
                            Meus Pedidos
                        </span>
                    </Link>
                </nav>
            </div>

            {/* Centro: Busca */}
            <div className="flex-1 max-w-xl relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="O que você busca hoje?"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        onSearch(e.target.value);
                    }}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 focus:bg-white focus:border-[#3f3bb1]/20 transition-all outline-none text-sm font-medium"
                />
            </div>

            {/* Direita: Carrinho e Perfil */}
            <div className="flex items-center gap-2 md:gap-4">
                <button onClick={onOpenCart} className="relative p-3 text-gray-700 hover:bg-indigo-50 hover:text-[#3f3bb1] rounded-2xl transition-all">
                    <ShoppingCart size={22} />
                    {cartCount > 0 && (
                        <span className="absolute top-1 right-1 bg-[#3f3bb1] text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                            {cartCount}
                        </span>
                    )}
                </button>

                <div className="hidden sm:flex flex-col items-end mr-2">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">Bem-vindo</span>
                    <span className="text-sm font-black text-gray-900 italic tracking-tighter">@{user.username || 'vinicius_dev'}</span>
                </div>

                <button onClick={handleLogout} className="p-3 text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;