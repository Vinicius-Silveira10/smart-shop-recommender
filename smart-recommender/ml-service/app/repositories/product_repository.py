from sqlalchemy.orm import Session
from sqlalchemy import text

class ProductRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_personalized_recs(self, user_id: int, category: str = None, limit: int = 5, offset: int = 0):
        # Corrigido: Método restaurado para evitar o AttributeError
        sql = """
              SELECT p.*, uip.category_strength
              FROM products p
                       JOIN user_interests_profile uip ON p.category = uip.category
              WHERE uip.user_id = :uid AND p.available = TRUE
              """
        if category:
            sql += " AND p.category = :cat"

        sql += """
            AND NOT EXISTS (
                SELECT 1 FROM interactions i 
                WHERE i.user_id = :uid AND i.product_id = p.product_id AND i.action_type = 'purchase'
            )
            ORDER BY uip.category_strength DESC, p.price DESC 
            LIMIT :lim OFFSET :off
        """
        params = {"uid": user_id, "lim": limit, "off": offset, "cat": category}
        # Retorna como mapeamento para o FastAPI converter em JSON corretamente
        return self.db.execute(text(sql), params).mappings().all()

    def get_popular_fallback(self, category: str = None, limit: int = 5, offset: int = 0):
        sql = "SELECT * FROM global_popularity_ranking WHERE 1=1"
        if category:
            sql += " AND category = :cat"
        sql += " LIMIT :lim OFFSET :off"
        return self.db.execute(text(sql), {"lim": limit, "off": offset, "cat": category}).mappings().all()

    def record_interaction(self, user_id: int, product_id: int, action_type: str):
        query = text("""
                     INSERT INTO interactions (user_id, product_id, action_type)
                     VALUES (:uid, :pid, :action)
                     """)
        try:
            self.db.execute(query, {"uid": user_id, "pid": product_id, "action": action_type})
            self.db.commit()
            return True
        except Exception as e:
            print(f"Erro ao gravar interação: {e}")
            self.db.rollback()
            return False

    def get_user_affinity(self, user_id: int):
        # Corrigido: Alterado 'affinity_score' para 'category_strength' para evitar UndefinedColumn
        query = text("""
                     SELECT category, category_strength
                     FROM user_interests_profile
                     WHERE user_id = :uid
                     ORDER BY category_strength DESC LIMIT 1
                     """)
        try:
            # Executa usando o objeto de sessão do SQLAlchemy
            result = self.db.execute(query, {"uid": user_id}).fetchone()
            return result
        except Exception as e:
            print(f"Erro ao buscar afinidade no banco: {e}")
            return None
