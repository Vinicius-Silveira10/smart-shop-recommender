# app/models/entities.py
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from app.database import Base

class Product(Base):
    __tablename__ = "products"
    product_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float)
    available = Column(Boolean, default=True)
    # Mapeia a coluna 'metadata' do banco para o atributo 'product_metadata'
    product_metadata = Column("metadata", JSONB)

class Interaction(Base):
    __tablename__ = "interactions"
    interaction_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    product_id = Column(Integer, ForeignKey("products.product_id"))
    action_type = Column(String)