import { Request, Response } from 'express';
// 🚀 Certifique-se de que o caminho e o nome do arquivo de serviço estão corretos
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
    /**
     * Lógica de Login
     */
    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }

            const result = await authService.login(username, password);

            // 🚀 O result já vem com o ID convertido para Number pelo AuthService atualizado
            return res.json(result);
        } catch (error: any) {
            console.error('❌ [AuthController] Erro no Login:', error.message);

            if (error.message === 'User not found' || error.message === 'Invalid password') {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            return res.status(500).json({
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    /**
     * Lógica de Registro
     */
    async register(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }

            const user = await authService.register(username, password);

            // 🚀 CORREÇÃO: Removemos a senha e garantimos que o ID seja Number para o JSON não quebrar
            const { password: _, ...userWithoutPassword } = user;

            const safeUser = {
                ...userWithoutPassword,
                id: Number(user.id) // Blindagem contra BigInt no registro
            };

            return res.status(201).json(safeUser);
        } catch (error: any) {
            console.error('❌ [AuthController] Erro no Registro:', error.message);

            if (error.message === 'Username already exists') {
                return res.status(409).json({ message: 'Username already exists' });
            }

            return res.status(500).json({
                message: 'Internal server error',
                details: error.message
            });
        }
    }
}