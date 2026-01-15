from app.repositories.product_repository import ProductRepository

class RecommendationService:
    def __init__(self, repo: ProductRepository):
        self.repo = repo

    def get_user_recommendations(self, user_id: int, category: str = None, page: int = 1, size: int = 5):
        offset = (page - 1) * size
        data = self.repo.get_personalized_recs(user_id, category, limit=size, offset=offset)
        strategy = "personalized"

        if not data:
            data = self.repo.get_popular_fallback(category, limit=size, offset=offset)
            strategy = "popularity_fallback"

        return {
            "user_id": user_id,
            "filter_applied": category,
            "strategy": strategy,
            "results": data
        }

    def log_interaction(self, user_id: int, product_id: int, action_type: str):
        return self.repo.record_interaction(user_id, product_id, action_type)