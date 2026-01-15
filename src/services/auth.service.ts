import { PrismaClient, User } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export class AuthService {
    async login(username: string, password: string): Promise<{ token: string; user: any }> {
        console.log(`🔎 Usuário "${username}" localizado! Iniciando autenticação...`);

        const user = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username.trim(),
                    mode: 'insensitive'
                }
            },
        });

        if (!user) {
            console.error(`❌ Erro: Usuário "${username}" não encontrado.`);
            throw new Error('User not found');
        }

        // Verificação de senha
        if (user.password !== password) {
            console.error(`❌ Erro: Senha inválida para "${username}".`);
            throw new Error('Invalid password');
        }

        // Gera o token convertendo o ID para string
        const token = jwt.sign(
            {
                userId: user.id.toString(), // Converte BigInt para String para o JWT
                username: user.username,
                role: user.roles
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 🚀 CORREÇÃO DEFINITIVA DO ERRO 500:
        // Criamos um objeto novo mapeando apenas os campos necessários.
        // Isso garante que NENHUM BigInt seja enviado no JSON.
        const safeUser = {
            id: Number(user.id), // Converte BigInt para Number
            username: user.username,
            email: user.email,
            roles: user.roles,
            name: user.name
        };

        console.log(`✅ Login bem-sucedido: ID ${safeUser.id}`);
        return { token, user: safeUser };
    }

    async register(username: string, password: string): Promise<any> {
        const existingUser = await prisma.user.findFirst({
            where: {
                username: { equals: username, mode: 'insensitive' }
            },
        });

        if (existingUser) {
            throw new Error('Username already exists');
        }

        const newUser = await prisma.user.create({
            data: {
                username,
                password,
                roles: 'USER', // Conforme o mapeamento do banco
            },
        });

        // Retorno seguro convertendo o ID para evitar erro 500
        return {
            id: Number(newUser.id),
            username: newUser.username,
            roles: newUser.roles
        };
    }
}