import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {

    /**
     * Auxiliar privado para converter tipos que o JSON não aceita (BigInt e Decimal)
     * Isso resolve o erro de retornar [] ou dar erro 500 no navegador.
     */
    private serializeProduct(product: any) {
        return {
            ...product,
            id: product.id.toString(), // Converte BigInt para String
            price: product.price ? Number(product.price) : 0, // Converte Decimal para Number
            // Campos adicionais mapeados do seu banco
            stockQuantity: product.stockQuantity ?? 0,
            imageUrl: product.imageUrl ?? null
        };
    }

    // 🔍 Busca todos os produtos (http://localhost:PORT/api/products)
    async getAll(req: Request, res: Response) {
        try {
            const products = await productService.getAllProducts();

            // Transforma cada produto da lista para um formato seguro para JSON
            const safeProducts = Array.isArray(products)
                ? products.map(p => this.serializeProduct(p))
                : [];

            console.log(`✅ ${safeProducts.length} produtos enviados para o cliente.`);
            return res.json(safeProducts);
        } catch (error) {
            console.error("❌ Erro ao buscar todos os produtos:", error);
            return res.status(500).json({ message: 'Error fetching products' });
        }
    }

    // 🎯 Filtra produtos por categoria, marca ou preço
    async filter(req: Request, res: Response) {
        try {
            const { category, brand, name, minPrice, maxPrice } = req.query;

            const filters: any = {};
            if (category) filters.category = String(category);
            if (brand) filters.brand = String(brand);
            if (name) filters.name = String(name);
            if (minPrice) filters.minPrice = parseFloat(String(minPrice));
            if (maxPrice) filters.maxPrice = parseFloat(String(maxPrice));

            const products = await productService.getFilteredProducts(filters);
            const safeProducts = Array.isArray(products)
                ? products.map(p => this.serializeProduct(p))
                : [];

            return res.json(safeProducts);
        } catch (error) {
            console.error("❌ Erro ao filtrar produtos:", error);
            return res.status(500).json({ message: 'Error filtering products' });
        }
    }

    // 🆔 Busca um produto específico pelo ID
    async getById(req: Request, res: Response) {
        try {
            const id = req.params.id; // Mantido como string para compatibilidade com BigInt
            const product = await productService.getProductById(id);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            return res.json(this.serializeProduct(product));
        } catch (error) {
            console.error(`❌ Erro ao buscar produto ${req.params.id}:`, error);
            return res.status(500).json({ message: 'Error fetching product' });
        }
    }

    // ✨ Cria um novo produto
    async create(req: Request, res: Response) {
        try {
            const { name, description, price, category, brand, imageUrl, stockQuantity, gender } = req.body;

            // Validação de campos obrigatórios conforme seu schema
            if (!name || price === undefined || !category || !brand) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const product = await productService.createProduct({
                name,
                description,
                price: parseFloat(price),
                category,
                brand,
                imageUrl,
                stockQuantity: parseInt(stockQuantity) || 0,
                gender: gender || 'Unissex' // Valor padrão baseado no seu DataGrip
            });

            return res.status(201).json(this.serializeProduct(product));
        } catch (error) {
            console.error("❌ Erro ao criar produto:", error);
            return res.status(500).json({ message: 'Error creating product' });
        }
    }

    // 📝 Atualiza um produto existente
    async update(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const updatedProduct = await productService.updateProduct(id, req.body);
            return res.json(this.serializeProduct(updatedProduct));
        } catch (error) {
            console.error(`❌ Erro ao atualizar produto ${req.params.id}:`, error);
            return res.status(500).json({ message: 'Error updating product' });
        }
    }

    // 🗑️ Remove um produto
    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await productService.deleteProduct(id);
            return res.status(204).send();
        } catch (error) {
            console.error(`❌ Erro ao deletar produto ${req.params.id}:`, error);
            return res.status(500).json({ message: 'Error deleting product' });
        }
    }
}