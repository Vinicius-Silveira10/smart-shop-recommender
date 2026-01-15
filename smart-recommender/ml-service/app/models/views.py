from sqlalchemy import Column, BigInteger, Integer
from app.database import Base

class UserProductSummary(Base):
    __tablename__ = "user_product_summary"
    # Como é uma VIEW, definimos apenas as colunas que vamos usar para a lógica
    user_id = Column(BigInteger, primary_key=True)
    product_id = Column(BigInteger, primary_key=True)
    total_interactions = Column(Integer)