import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Iniciando verificação de banco...");

    // 1. Tenta criar o usuário se ele não existir
    const user = await prisma.user.upsert({
        where: { username: 'vinicius' },
        update: {},
        create: {
            username: 'vinicius',
            password: '123',
            roles: 'ADMIN',
            email: 'vinicius@teste.com',
            name: 'Vinícius Admin'
        },
    });

    console.log("✅ Usuário no banco:", user);

    // 2. Lista todos os usuários na tabela 'users'
    const allUsers = await prisma.user.findMany();
    console.log("👥 Total de usuários encontrados:", allUsers.length);
}

main()
    .catch((e) => console.error("❌ Erro:", e))
    .finally(async () => await prisma.$disconnect());