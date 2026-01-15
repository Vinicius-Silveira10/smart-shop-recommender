import { useState } from 'react';
import { Filter, ChevronDown, Check, Monitor, Smartphone, MousePointer, Shirt } from 'lucide-react';

// Hierarquia atualizada incluindo Computadores
const categoriesHierarchy = {
    'Computadores': ['Notebooks', 'Desktops', 'All-in-One', 'Workstations'],
    'Smartphones': ['iOS', 'Android', 'Acessórios'],
    'Periféricos': ['Mouse', 'Teclado', 'Headset', 'Monitor'],
    'Roupas': ['Camisetas', 'Calças', 'Calçados']
};

// Marcas sugeridas para tecnologia
const techBrands = ['Apple', 'Dell', 'Samsung', 'Logitech', 'Razer', 'HP', 'Lenovo'];

export const FilterSidebar = ({ onFilterChange }: { onFilterChange: (f: any) => void }) => {
    const [selectedCat, setSelectedCat] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [price, setPrice] = useState({ min: 1500, max: 2000 });

    const handleApply = (subcategory: string = '') => {
        onFilterChange({
            category: selectedCat,
            subcategory,
            brand: selectedBrand,
            minPrice: price.min,
            maxPrice: price.max
        });
    };

    return (
        <div className="p-4 space-y-8 bg-white h-full">
            <div className="flex items-center gap-2 text-[#3f3bb1] font-black border-b pb-4">
                <Filter size={20} />
                <span className="tracking-widest text-xs uppercase">Filtros Avançados</span>
            </div>

            {/* 📂 SEÇÃO 1: Categorias e Subcategorias */}
            <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Navegar por Categoria</label>
                {Object.entries(categoriesHierarchy).map(([cat, subs]) => (
                    <div key={cat} className="space-y-1">
                        <button
                            onClick={() => setSelectedCat(selectedCat === cat ? '' : cat)}
                            className={`w-full text-left p-3 rounded-xl text-sm font-bold flex justify-between items-center transition-all ${
                                selectedCat === cat ? 'bg-[#3f3bb1] text-white shadow-lg' : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                {cat === 'Computadores' && <Monitor size={16} />}
                                {cat === 'Smartphones' && <Smartphone size={16} />}
                                {cat === 'Periféricos' && <MousePointer size={16} />}
                                {cat === 'Roupas' && <Shirt size={16} />}
                                {cat}
                            </span>
                            <ChevronDown size={14} className={selectedCat === cat ? 'rotate-180' : ''} />
                        </button>

                        {selectedCat === cat && (
                            <div className="pl-6 space-y-1 py-2 animate-in slide-in-from-top-2">
                                {subs.map(sub => (
                                    <button
                                        key={sub}
                                        onClick={() => handleApply(sub)}
                                        className="w-full text-left p-2 text-xs text-gray-500 hover:text-[#3f3bb1] font-medium"
                                    >
                                        • {sub}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 🏷️ SEÇÃO 2: Marcas (Aparece para Tech) */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marcas Recomendadas</label>
                <div className="grid grid-cols-2 gap-2">
                    {techBrands.map(brand => (
                        <button
                            key={brand}
                            onClick={() => {
                                const newBrand = selectedBrand === brand ? '' : brand;
                                setSelectedBrand(newBrand);
                                onFilterChange({ category: selectedCat, brand: newBrand, minPrice: price.min, maxPrice: price.max });
                            }}
                            className={`p-2 rounded-lg text-[10px] font-bold border transition-all flex justify-between items-center ${
                                selectedBrand === brand
                                    ? 'bg-[#3f3bb1]/10 border-[#3f3bb1] text-[#3f3bb1]'
                                    : 'border-gray-100 text-gray-400 hover:border-gray-300'
                            }`}
                        >
                            {brand}
                            {selectedBrand === brand && <Check size={10} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* 💰 SEÇÃO 3: Faixa de Preço */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Faixa de Preço (R$)</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        value={price.min}
                        onChange={(e) => setPrice({...price, min: Number(e.target.value)})}
                        className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#3f3bb1]"
                        placeholder="Mín"
                    />
                    <span className="text-gray-300">-</span>
                    <input
                        type="number"
                        value={price.max}
                        onChange={(e) => setPrice({...price, max: Number(e.target.value)})}
                        className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#3f3bb1]"
                        placeholder="Máx"
                    />
                </div>
                <button
                    onClick={() => handleApply()}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                >
                    Filtrar Resultados
                </button>
            </div>
        </div>
    );
};