import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // 🚀 ESSENCIAL: Rode 'npm install jwt-decode' no terminal do frontend

// URL do Gateway que aponta para o seu serviço de autenticação
const API_URL = 'http://localhost:8082/api/auth';

export const AuthService = {
    /**
     * Realiza o login, limpa o token e decodifica os dados do usuário.
     */
    login: async (username: string, password: string) => {
        // Envia a requisição para o Gateway (8082)
        const response = await axios.post(`${API_URL}/login`, { username, password });

        if (response.data.token) {
            // 1. Limpa o token de aspas para evitar erro 403 nas chamadas seguintes
            const cleanToken = response.data.token.replace(/"/g, '');
            localStorage.setItem('token', cleanToken);

            // 2. Decodifica o token para extrair userId e roles sem erro de 'Buffer'
            const decodedUser: any = jwtDecode(cleanToken);

            // 3. Monta o objeto do usuário garantindo que o ID e Roles estejam corretos
            const fullUserData = {
                ...response.data.user,
                // Prioriza o ID vindo do token (já tratado como string/number no backend)
                id: decodedUser.userId || response.data.user.id,
                // Garante que o campo 'roles' (plural) seja reconhecido
                roles: decodedUser.role || response.data.user.roles
            };

            localStorage.setItem('user', JSON.stringify(fullUserData));
            return { token: cleanToken, user: fullUserData };
        }
        return response.data;
    },

    /**
     * Envia os dados para criação de um novo usuário.
     */
    register: async (userData: any) => {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    },

    /**
     * Limpa o LocalStorage e redireciona para a tela de login.
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    /**
     * Recupera os dados do usuário salvo no navegador.
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');

        if (!userStr || userStr === 'undefined' || userStr === 'null') {
            return null;
        }

        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error("❌ Erro ao ler dados do usuário no LocalStorage");
            return null;
        }
    },

    /**
     * Atalho para pegar o ID do usuário (importante para o CartService).
     */
    getUserId: () => {
        const user = AuthService.getCurrentUser();
        return user?.id || null;
    }
};