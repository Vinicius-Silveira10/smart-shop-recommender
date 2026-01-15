import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Filter, Laptop, Smartphone, Monitor, Book, Shirt } from 'lucide-react';

const categoryTree = [
    { id: 'computadores', name: 'Computadores', icon: <Laptop size={20} />, subcategories: ['Notebooks', 'Desktops', 'Gamer'] },
    { id: 'eletronicos', name: 'Eletrônicos', icon: <Smartphone size={20} />, subcategories: ['Celulares', 'Tablets'] },
    { id: 'perifericos', name: 'Periféricos', icon: <Monitor size={20} />, subcategories: ['Monitores', 'Teclados'] },
    { id: 'livros', name: 'Livros', icon: <Book size={20} />, subcategories: ['Programação', 'Design'] }, // Resolvido TS6133
    { id: 'moda', name: 'Roupas', icon: <Shirt size={20} />, subcategories: ['Camisetas', 'Acessórios'] } // Resolvido TS6133
];

const CategorySidebar: React.FC<{ onFilterChange: (f: any) => void }> = ({ onFilterChange }) => {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [price, setPrice] = useState(15000);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    const handleBrandChange = (brand: string) => {
        const brands = selectedBrands.includes(brand)
            ? selectedBrands.filter(b => b !== brand)
            : [...selectedBrands, brand];
        setSelectedBrands(brands);
        onFilterChange({ brands });
    };

    return (
        <aside className="w-72 hidden lg:flex flex-col bg-white border-r border-gray-100 p-8 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
            <h3 className="text-[10px] font-black text-gray-400 uppercase mb-8 tracking-[0.2em]">Categorias</h3>
            <div className="space-y-4 mb-12">
                {categoryTree.map(cat => (
                    <div key={cat.id}>
                        <button onClick={() => setExpanded(expanded === cat.id ? null : cat.id)} className={`w-full flex items-center justify-between py-2 font-black transition-colors ${expanded === cat.id ? 'text-[#3f3bb1]' : 'text-gray-700 hover:text-[#3f3bb1]'}`}>
                            <div className="flex items-center gap-3">{cat.icon} {cat.name}</div>
                            {expanded === cat.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        {expanded === cat.id && (
                            <div className="ml-8 mt-4 space-y-4 border-l-2 border-gray-50">
                                {cat.subcategories.map(sub => (
                                    <button key={sub} onClick={() => onFilterChange({ subcategory: sub })} className="block w-full text-left pl-6 text-sm font-bold text-gray-500 hover:text-[#3f3bb1]">{sub}</button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="pt-10 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-8 text-[#3f3bb1]">
                    <Filter size={20} />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Filtros</h3>
                </div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-4">Até R$ {price.toLocaleString()}</label>
                <input type="range" min="100" max="15000" step="100" value={price} onChange={(e) => { setPrice(Number(e.target.value)); onFilterChange({ maxPrice: Number(e.target.value) }); }} className="w-full h-2 bg-gray-100 rounded-lg accent-[#3f3bb1] mb-10" />

                <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Marcas</h4>
                <div className="space-y-3">
                    {['Apple', 'Dell', 'Samsung'].map(brand => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => handleBrandChange(brand)}
                                className="w-5 h-5 rounded border-gray-200 text-[#3f3bb1] focus:ring-[#3f3bb1]"
                            />
                            <span className="text-sm font-bold text-gray-600 group-hover:text-[#3f3bb1]">{brand}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default CategorySidebar;