// Define a estrutura do Produto vindo do Java (ProductDTO)
export interface Product {
    id: number;
    name: string; // Mapeado do 'name' no Java
    description: string | null; // Pode ser null conforme seu banco
    price: number; // No Java é Double/BigDecimal
    category: string;
    imageUrl: string | null; // Mapeado do 'imageUrl'
    stockQuantity?: number;
}

// Define a estrutura do Usuário para o Login e Dashboard
export interface User {
    user_id: number; // Chave primária do seu banco
    username: string;
    email?: string;
}

// Define a estrutura das Interações para a IA e Histórico
export interface Interaction {
    interaction_id?: number;
    userId: number;
    productId: number;
    actionType: 'view' | 'cart' | 'purchase'; // Tipos que vimos no seu banco
    timestamp: string;
}