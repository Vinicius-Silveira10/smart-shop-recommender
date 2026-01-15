import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';

export const cartController = {
    /**
     * Busca o carrinho do usuário.
     * CORREÇÃO: Agora utiliza req.params para capturar o ID da URL /api/cart/:userId
     */
    getCart: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            const cart = await cartService.getCart(Number(userId));
            res.json(cart);
        } catch (error) {
            console.error("Erro no getCart Controller:", error);
            res.status(500).json({ message: 'Error fetching cart', error });
        }
    },

    /**
     * Adiciona um produto ao carrinho.
     */
    addToCart: async (req: Request, res: Response) => {
        try {
            // O userId vem do middleware de autenticação (authenticateToken)
            const userId = (req as any).user.userId;
            const { productId, quantity } = req.body;

            if (!productId || !quantity) {
                return res.status(400).json({ message: 'ProductId and quantity are required' });
            }

            const item = await cartService.addToCart(userId, productId, quantity);
            res.status(201).json(item);
        } catch (error) {
            console.error("Erro no addToCart Controller:", error);
            res.status(500).json({ message: 'Error adding to cart', error });
        }
    },

    /**
     * Remove um item específico do carrinho.
     */
    removeFromCart: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { id } = req.params;

            if (!id) return res.status(400).json({ message: 'Item ID is required' });

            await cartService.removeFromCart(userId, parseInt(id));
            res.json({ message: 'Item removed' });
        } catch (error: any) {
            if (error.message === 'Item not found or access denied') {
                return res.status(403).json({ message: error.message });
            }
            console.error("Erro no removeFromCart Controller:", error);
            res.status(500).json({ message: 'Error removing item', error });
        }
    },

    /**
     * NOVIDADE: Limpa todo o carrinho de um usuário.
     * Resolve o erro TS 2339 e permite finalizar o checkout sem erros 404/403.
     */
    clearCart: async (req: Request, res: Response) => {
        try {
            // Captura o userId da rota DELETE /api/cart/clean/:userId
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ message: 'User ID is required for clearing cart' });
            }

            // Chama o serviço para remover todos os itens via Prisma/DB
            await cartService.clearCart(Number(userId));

            console.log(`[Node] Carrinho do usuário ${userId} limpo com sucesso.`);
            res.json({ message: 'Cart cleared successfully' });
        } catch (error) {
            console.error("Erro no clearCart Controller:", error);
            res.status(500).json({ message: 'Error clearing cart', error });
        }
    }
};