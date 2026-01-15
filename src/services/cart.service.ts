import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const cartService = {
    /**
     * Busca o carrinho do usuário. 
     * Tipagem atualizada para aceitar bigint, string ou number.
     */
    getCart: async (userId: bigint | number | string) => {
        const bigIntUserId = BigInt(userId); // Conversão explícita para evitar Erro 2322

        let cart = await prisma.cart.findUnique({
            where: { userId: bigIntUserId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: bigIntUserId },
                include: {
                    items: {
                        include: { product: true }
                    }
                }
            });
        }
        return cart;
    },

    /**
     * Adiciona item ao carrinho tratando IDs como BigInt.
     */
    addToCart: async (userId: bigint | number | string, productId: bigint | number | string, quantity: number) => {
        const cart = await cartService.getCart(userId);
        const bigIntProductId = BigInt(productId);

        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id, // cart.id é Int comum no schema
                    productId: bigIntProductId
                }
            }
        });

        if (existingItem) {
            return prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        } else {
            return prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: bigIntProductId,
                    quantity
                }
            });
        }
    },

    /**
     * Remove item verificando a propriedade do carrinho.
     */
    removeFromCart: async (userId: bigint | number | string, cartItemId: number) => {
        const cart = await cartService.getCart(userId);

        const item = await prisma.cartItem.findFirst({
            where: {
                id: cartItemId,
                cartId: cart.id
            }
        });

        if (!item) throw new Error("Item não encontrado ou acesso negado");

        return prisma.cartItem.delete({
            where: { id: cartItemId }
        });
    },

    /**
     * Limpa o carrinho.
     */
    clearCart: async (userId: bigint | number | string) => {
        const cart = await cartService.getCart(userId);
        return prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });
    }
};