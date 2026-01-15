import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, Check, User, Monitor } from 'lucide-react';

interface FilterConfig {
    types: string[];
    brands: string[];
    hasGender: boolean;
}

const filterSettings: Record<string, FilterConfig> = {
    'Computadores': {
        types: ['Laptops', 'Desktops', 'Workstations'],
        brands: ['Dell', 'Apple', 'HP', 'Lenovo', 'Asus', 'Arena'],
        hasGender: false
    },
    'Roupas': {
        types: ['Camisetas', 'Calças', 'Casacos', 'Calçados', 'Vestidos'],
        brands: ['Nike', 'Adidas', 'Zara', 'Levis', 'Puma'],
        hasGender: true
    },
    'Periféricos': {
        types: ['Teclados', 'Mouses', 'Áudio', 'Monitor'],
        brands: ['Logitech', 'Razer', 'Corsair', 'HyperX', 'Sony', 'JBL'],
        hasGender: false
    },
    'Smartphones': {
        types: ['iOS', 'Android', 'Acessórios'],
        brands: ['Apple', 'Samsung', 'Xiaomi', 'Motorola'],
        hasGender: false
    }
};

export const AdvancedFilterSidebar = ({ currentCategory, onFilterChange }: any) => {
    const config = filterSettings[currentCategory];

    const [activeFilters, setActiveFilters] = useState({
        subcategory: '',
        brand: '',
        gender: '',
        minPrice: 0,
        maxPrice: 10000
    });

    useEffect(() => {
        const reset = { subcategory: '', brand: '', gender: '', minPrice: 0, maxPrice: 10000 };
        setActiveFilters(reset);
    }, [currentCategory]);

    // Ajustada para aceitar string ou number
    const handleUpdate = (key: string, value: string | number) => {
        const newValue = activeFilters[key as keyof typeof activeFilters] === value ? '' : value;
        const updated = { ...activeFilters, [key]: newValue };

        setActiveFilters(updated);
        onFilterChange(updated);
    };

    if (!config) {
        return (
            <div className="p-8 text-gray-400 text-sm text-center italic">
                Selecione uma categoria acima para refinar sua busca
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 bg-white h-full animate-in fade-in duration-500">
            <h3 className="text-xs font-black text-[#3f3bb1] uppercase tracking-widest flex items-center gap-2">
                <Filter size={16} /> Filtros de {currentCategory}
            </h3>

            {/* SEÇÃO: PÚBLICO ALVO */}
            {config.hasGender && (
                <section className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <User size={16} className="text-[#3f3bb1]" /> Público Alvo
                    </label>
                    <div className="flex gap-2">
                        {['MASC', 'FEM', 'UNIS'].map(g => (
                            <button
                                key={g}
                                onClick={() => handleUpdate('gender', g)}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all flex justify-center items-center gap-1 ${activeFilters.gender === g
                                        ? 'bg-[#3f3bb1] border-[#3f3bb1] text-white shadow-md'
                                        : 'border-gray-100 text-gray-400 hover:border-gray-200 bg-gray-50/50'
                                    }`}
                            >
                                {activeFilters.gender === g && <Check size={10} />}
                                {g}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* SEÇÃO: MARCAS */}
            <section className="space-y-3 pt-6 border-t border-gray-100">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Monitor size={16} className="text-[#3f3bb1]" /> Marcas
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {config.brands.map((b) => (
                        <button
                            key={b}
                            onClick={() => handleUpdate('brand', b)}
                            className={`p-3 rounded-xl text-[11px] font-bold border transition-all flex justify-between items-center ${activeFilters.brand === b
                                    ? 'bg-[#3f3bb1]/10 border-[#3f3bb1] text-[#3f3bb1]'
                                    : 'border-gray-50 text-gray-400 hover:border-gray-200 bg-gray-50/30'
                                }`}
                        >
                            <span className="truncate">{b}</span>
                            {activeFilters.brand === b && <Check size={12} />}
                        </button>
                    ))}
                </div>
            </section>

            {/* SEÇÃO: SUBCATEGORIAS */}
            <section className="space-y-3 pt-6 border-t border-gray-100">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <ChevronDown size={16} className="text-[#3f3bb1]" /> Subcategorias
                </label>
                <div className="flex flex-col gap-1">
                    {config.types.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleUpdate('subcategory', type)}
                            className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeFilters.subcategory === type
                                    ? 'text-[#3f3bb1] bg-[#3f3bb1]/5 font-black italic'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#3f3bb1]'
                                }`}
                        >
                            {activeFilters.subcategory === type ? '• ' : ''} {type}
                        </button>
                    ))}
                </div>
            </section>

            {/* SEÇÃO: FAIXA DE PREÇO (MOVIDA PARA DENTRO DO RETURN) */}
            <section className="space-y-4 pt-6 border-t border-gray-100">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <span className="text-[#3f3bb1]">R$</span> Faixa de Preço
                </label>
                <div className="space-y-4">
                    <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={activeFilters.maxPrice}
                        onChange={(e) => handleUpdate('maxPrice', Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3f3bb1]"
                    />
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Até</span>
                            <div className="font-black text-gray-900">
                                {Number(activeFilters.maxPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                        </div>
                        <button
                            onClick={() => handleUpdate('maxPrice', 10000)}
                            className="text-[10px] font-black text-[#3f3bb1] uppercase hover:underline"
                        >
                            Resetar
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};