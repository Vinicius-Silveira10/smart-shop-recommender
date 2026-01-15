import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';

const app = express();

/**
 * 🚀 CORREÇÃO GLOBAL PARA BIGINT
 * Garante que o Node consiga enviar IDs do tipo BigInt para o Frontend sem travar.
 */
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

/**
 * CONFIGURAÇÃO DE CORS EXPANSIVA
 */
const corsOptions = {
    origin: 'http://localhost:5173', // URL do seu Frontend Vite
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Prefixos de rotas configurados para o Gateway (8082)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Smart Recommender API is running!' });
});

/**
 * 🛠️ MIDDLEWARE DE ERRO GLOBAL
 * Esta é a peça que falta para você debugar o Erro 500.
 * Ele captura o erro e imprime a mensagem exata no terminal do VS Code.
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('❌ ERRO NO SERVIDOR:', err.message);
    console.error('📂 STACK TRACE:', err.stack);

    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Erro interno no servidor',
        // Opcional: só envie o stack em desenvolvimento
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default app;