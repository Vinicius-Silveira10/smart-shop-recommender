import { Router } from 'express';
import { cartController } from '../controllers/cartController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Middleware de autenticação para todas as rotas abaixo
router.use(authenticateToken);

/**
 * 1. Rota de adição (POST /api/cart/add)
 */
router.post('/add', cartController.addToCart);

/**
 * 2. Rota de busca (GET /api/cart/:userId) 
 * Busca todos os itens do carrinho de um usuário específico.
 */
router.get('/:userId', cartController.getCart);

/**
 * 3. NOVIDADE: Rota de limpeza total (DELETE /api/cart/clean/:userId)
 * Essencial para o fluxo de Checkout. 
 * Deve vir ANTES da rota de remoção por ID para evitar conflitos de rota.
 */
router.delete('/clean/:userId', cartController.clearCart);

/**
 * 4. Rota de remoção individual (DELETE /api/cart/:id)
 * Remove um item específico (ID da entrada no banco) do carrinho.
 */
router.delete('/:id', cartController.removeFromCart);

export default router;