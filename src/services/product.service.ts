import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductService {
    // 🔍 Busca todos os produtos ordenados pelos mais novos
    async getAllProducts(): Promise<Product[]> {
        return prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * getFilteredProducts: Suporte total aos campos vistos no DataGrip
     */
    async getFilteredProducts(filters: any): Promise<Product[]> {
        const { category, brand, name, minPrice, maxPrice, subcategory, gender } = filters;

        return prisma.product.findMany({
            where: {
                AND: [
                    // Filtro por categoria (Ex: 'Computadores', 'Roupas')
                    category ? { category: { equals: category, mode: 'insensitive' } } : {},

                    // Filtro por subcategoria (Ex: 'Laptops', 'Mouses')
                    subcategory ? { subcategory: { equals: subcategory, mode: 'insensitive' } } : {},

                    // Filtro por gênero (Ex: 'Masculino', 'Unissex')
                    gender ? { gender: { equals: gender, mode: 'insensitive' } } : {},

                    // Filtro por marca (Ex: 'Apple', 'Nike')
                    brand ? { brand: { equals: brand, mode: 'insensitive' } } : {},

                    // Busca por nome (Contém o texto)
                    name ? { name: { contains: name, mode: 'insensitive' } } : {},

                    // Faixa de preço (Decimal no banco)
                    minPrice ? { price: { gte: parseFloat(minPrice) } } : {},
                    maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {},
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Criação de produto: Converte tipos para evitar erro de gravação
     */
    async createProduct(data: any): Promise<Product> {
        return prisma.product.create({
            data: {
                ...data,
                // Garante que valores numéricos entrem no formato correto
                price: data.price ? parseFloat(data.price) : 0,
                stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity) : 0,
            },
        });
    }

    // 🆔 Busca por ID único (Corrigido para BigInt conforme seu schema)
    async getProductById(id: string | number): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { id: BigInt(id) },
        });
    }

    // 📝 Atualização de dados parcial com conversão de tipos
    async updateProduct(id: string | number, data: any): Promise<Product> {
        return prisma.product.update({
            where: { id: BigInt(id) },
            data: {
                ...data,
                price: data.price ? parseFloat(data.price) : undefined,
                stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity) : undefined,
            },
        });
    }

    // 🗑️ Exclusão física usando BigInt
    async deleteProduct(id: string | number): Promise<Product> {
        return prisma.product.delete({
            where: { id: BigInt(id) },
        });
    }
}