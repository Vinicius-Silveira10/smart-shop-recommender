from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import uvicorn
import logging

# Configuração de Logs para facilitar o seu debug no terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SmartShop IA Service")

# Configuração de CORS para permitir acesso do Frontend (5173) e Gateway (8082)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Interaction(BaseModel):
    user_id: int
    product_id: int
    action_type: str

# Mapa de Afinidade: Define o que sugerir com base no que foi comprado
# DICA: Você pode adicionar IDs de produtos aqui também como chaves "1", "2"...
AFFINITY_MAP = {
    "TENIS": [1, 2, 5],       # Se comprou Tênis, sugere IDs 1, 2 e 5
    "Macbook M3": [3, 4, 6],
    "Dell XPS": [3, 4, 5],
    "Computadores": [3, 4],
    "Periféricos": [5, 6],
    "Roupas": [1, 2]          # Sincronizado com a categoria do Dashboard
}

# Fallback: Produtos padrão caso o usuário não tenha histórico ou a IA falhe
DEFAULT_RECOMMENDATIONS = [1, 2, 3]

JAVA_GATEWAY_URL = "http://localhost:8082/api/orders/user"

@app.get("/recommendations/{user_id}")
async def get_smart_recommendations(user_id: int, k: int = 5):
    """
    Analisa o histórico de pedidos no Java e gera sugestões baseadas em afinidade.
    """
    try:
        async with httpx.AsyncClient() as client:
            # Busca pedidos via Gateway (8082) com timeout curto para não travar o Dashboard
            response = await client.get(f"{JAVA_GATEWAY_URL}/{user_id}", timeout=3.0)
            
            if response.status_code != 200:
                logger.warning(f"Java Service retornou erro {response.status_code}. Usando fallback.")
                return {"results": [{"product_id": pid} for pid in DEFAULT_RECOMMENDATIONS]}
            
            user_orders = response.json()

        recommended_ids = set()

        # Se não houver pedidos, retorna a lista padrão
        if not user_orders or not isinstance(user_orders, list):
            return {"results": [{"product_id": pid} for pid in DEFAULT_RECOMMENDATIONS]}

        # LÓGICA DE IA: Varre os itens dos pedidos reais do Java
        for order in user_orders:
            # O Java envia uma lista de 'items'
            items = order.get("items", [])
            for item in items:
                # 1. Tenta afinidade pelo ID do produto (convertido para string)
                pid_str = str(item.get("productId"))
                if pid_str in AFFINITY_MAP:
                    recommended_ids.update(AFFINITY_MAP[pid_str])
                
                # 2. Tenta afinidade pelo Nome ou Categoria (se disponível no JSON do Java)
                # O Java costuma enviar o nome do produto no histórico de itens
                p_name = item.get("productName") or item.get("name")
                if p_name and p_name in AFFINITY_MAP:
                    recommended_ids.update(AFFINITY_MAP[p_name])

        # Converte o set para lista e limita ao parâmetro 'k' do frontend
        final_list = list(recommended_ids)
        
        # Se a lógica não encontrou nada específico, preenche com os padrões
        if not final_list:
            final_list = DEFAULT_RECOMMENDATIONS

        # Garante que a lista tenha no máximo 'k' itens
        final_list = final_list[:k]
        
        logger.info(f"Usuário {user_id}: {len(final_list)} recomendações geradas.")
        return {"results": [{"product_id": pid} for pid in final_list]}

    except Exception as e:
        logger.error(f"Erro na IA: {e}")
        # Fallback de segurança absoluto para nunca deixar o Dashboard vazio
        return {"results": [{"product_id": pid} for pid in DEFAULT_RECOMMENDATIONS]}

@app.get("/profile/{user_id}")
async def get_user_profile(user_id: int):
    return {
        "user_id": user_id,
        "primary_interest": "TENIS",
        "score": 98,
        "status": "VIP"
    }

@app.post("/interact")
async def log_interaction(interaction: Interaction):
    # O Pydantic valida automaticamente o JSON recebido
    logger.info(f"Interação: User {interaction.user_id} -> Prod {interaction.product_id} ({interaction.action_type})")
    return {"status": "success"}

if __name__ == "__main__":
    # Roda o servidor na porta 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)