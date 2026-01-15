from pydantic import BaseModel
from typing import List, Optional, Literal

class InteractionCreate(BaseModel):
    user_id: int
    product_id: int
    action_type: Literal['view', 'click', 'add_to_cart', 'purchase']

class ProductRecommendation(BaseModel):
    product_id: int
    name: str
    category: str
    price: float
    category_strength: Optional[float] = None # Vindo das Views de Scoring

    class Config:
        from_attributes = True