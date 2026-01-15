// src/services/BaseAPI.ts

export const NODE_API_URL = "http://localhost:8082";
export const JAVA_API_URL = "http://localhost:8083";

/**
 * Cliente de API Universal com Injeção de Token JWT.
 * Ajustado para distinguir entre Sessão Expirada (401) e Acesso Negado (403).
 */
export const apiClient = async (baseUrl: string, endpoint: any, options: RequestInit = {}) => {
    // 1. Recupera o token e remove aspas extras para evitar tokens malformados
    const rawToken = localStorage.getItem('token');
    const token = rawToken ? rawToken.replace(/"/g, '') : null;

    // 2. Normaliza o endpoint para garantir que comece com /api
    const endpointStr = String(endpoint);
    const path = endpointStr.startsWith('/api') ? endpointStr : `/api${endpointStr}`;
    const url = `${baseUrl}${path}`;

    // 3. Configura cabeçalhos de segurança
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    // 4. Injeta o Bearer Token se disponível
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // --- TRATAMENTO DE ERROS INTELIGENTE ---

        /**
         * MELHORIA 1: Erro 401 (Unauthorized)
         * Indica que o token expirou ou é inexistente. Aqui o LOGOUT é obrigatório.
         */
        if (response.status === 401) {
            console.warn(`[BaseAPI] Sessão expirada em ${path}. Redirecionando...`);
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
            return response;
        }

        /**
         * MELHORIA 2: Erro 403 (Forbidden)
         * O usuário está logado, mas não tem permissão para esta ação específica (ex: DELETE).
         * NÃO limpamos as credenciais aqui para evitar loops de logout.
         */
        if (response.status === 403) {
            console.error(`[BaseAPI] Erro 403 (Acesso Negado) em ${path}. Verifique as permissões do backend.`);
            // Apenas retornamos a resposta para o componente tratar o erro localmente
            return response;
        }

        // Erro 503: Microsserviço de IA (Python) Offline
        if (response.status === 503) {
            console.error("Erro 503: O serviço de IA (Porta 8000) está temporariamente indisponível.");
        }

        return response;
    } catch (error) {
        console.error("Erro de Rede/Conexão:", error);
        throw error;
    }
};