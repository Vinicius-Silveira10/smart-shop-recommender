import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { AuthService } from '../services/AuthService';
import type { Product } from '../types';

interface CartItem {
    id: number;
    productId: number;
    quantity: number;
    product: Product;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number) => Promise<void>;
    removeFromCart: (cartItemId: number) => Promise<void>;
    refreshCart: () => Promise<void>;
    clearLocalCart: () => void;
    total: number;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Atualiza os itens do carrinho buscando do servidor Node (8085).
     * O uso de useCallback evita loops de renderização infinitos.
     */
    const refreshCart = useCallback(async () => {
        const token = localStorage.getItem('token');
        const user = AuthService.getCurrentUser();
        const userId = user?.id || user?.user_id;

        // Se não houver token ou usuário, limpamos o estado e abortamos a chamada
        if (!token || !userId) {
            setCart([]);
            return;
        }

        try {
            // Chamada sem argumentos: o serviço obtém os dados do token/storage internamente
            const response = await cartService.getCart();

            // Lida com o formato de resposta do seu backend (Array direto ou objeto com campo items)
            const items = Array.isArray(response) ? response : (response?.items || []);
            setCart(items);
        } catch (error) {
            console.warn("CartContext: Falha ao sincronizar carrinho.");
            setCart([]);
        }
    }, []);

    /**
     * Limpa o estado local (útil durante o logout ou após finalizar compra).
     */
    const clearLocalCart = useCallback(() => {
        setCart([]);
        setIsOpen(false);
    }, []);

    // Dispara a busca inicial quando o Provider é montado
    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = async (product: Product, quantity = 1) => {
        try {
            // Sincronizado com cartService (2 argumentos: productId e quantity)
            await cartService.addToCart(product.id, quantity);
            await refreshCart();
            setIsOpen(true);
        } catch (error) {
            console.error("Erro ao adicionar produto:", error);
        }
    };

    const removeFromCart = async (cartItemId: number) => {
        try {
            await cartService.removeFromCart(cartItemId);
            await refreshCart();
        } catch (error) {
            console.error("Erro ao remover produto:", error);
        }
    };

    /**
     * Calcula o total garantindo que o preço seja tratado como número.
     */
    const total = useMemo(() => {
        return cart.reduce((sum, item) => {
            const price = Number(item.product?.price) || 0;
            return sum + (price * item.quantity);
        }, 0);
    }, [cart]);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            refreshCart,
            clearLocalCart,
            total,
            isOpen,
            setIsOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};