import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();
const productController = new ProductController();

/**
 * ROTA DE FILTRO (Crítica para o Dashboard)
 * Deve vir ANTES de /:id para evitar conflitos de roteamento.
 * Resolve o erro 400 (Bad Request) observado no console.
 */
router.get('/filter', productController.filter.bind(productController));

// Rota Pública: Buscar todos os produtos
router.get('/', productController.getAll.bind(productController));

// Rota Pública: Buscar produto por ID (Parâmetros variáveis ficam por último)
router.get('/:id', productController.getById.bind(productController));

// Rota Protegida: Criar produto (Apenas ADMIN)
router.post('/', authenticateToken, requireRole('ADMIN'), productController.create.bind(productController));

// Rota Protegida: Atualizar produto (Apenas ADMIN)
router.put('/:id', authenticateToken, requireRole('ADMIN'), productController.update.bind(productController));

// Rota Protegida: Deletar produto (Apenas ADMIN)
router.delete('/:id', authenticateToken, requireRole('ADMIN'), productController.delete.bind(productController));

export default router;