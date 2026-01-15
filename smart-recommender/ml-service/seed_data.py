# seed_data.py
import random
from app.database import SessionLocal
from app.models.entities import Product

def seed():
    db = SessionLocal()
    # Opcional: Limpa a tabela antes de popular (Cuidado: apaga tudo!)
    db.query(Product).delete()
    categories = ['Eletrônicos', 'Educação', 'Periféricos', 'Livros', 'Cozinha']
    tags_pool = ['tech', 'dev', 'home', 'study', 'gaming', 'office']

    products = []
    for i in range(1, 51):
        p = Product(
            name=f"Produto Exemplo {i}",
            category=random.choice(categories),
            price=round(random.uniform(50, 5000), 2),
            available=True,
            product_metadata={"tags": random.sample(tags_pool, 2)}
        )
        products.append(p)

    db.add_all(products)
    db.commit()
    print("✅ 50 produtos inseridos com sucesso!")
    db.close()

if __name__ == "__main__":
    seed()