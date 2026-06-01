from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models.product import Product
from models.customer import Customer
from models.order import Order

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db)
):
    total_products = db.query(Product).count()

    total_customers = db.query(Customer).count()

    total_orders = db.query(Order).count()

    low_stock_products = (
        db.query(Product)
        .filter(Product.quantity < 10)
        .all()
    )

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_products": [
            {
                "id": product.id,
                "name": product.name,
                "sku": product.sku,
                "quantity": product.quantity,
                "price": product.price
            }
            for product in low_stock_products
        ]
    }