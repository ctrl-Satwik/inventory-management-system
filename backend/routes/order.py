from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models.order import Order
from models.customer import Customer
from models.product import Product
from schemas.order import OrderCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/orders")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):
    customer = db.get(Customer, order.customer_id)

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    product = db.get(Product, order.product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if order.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    if product.quantity < order.quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock"
        )

    total_amount = product.price * order.quantity

    product.quantity -= order.quantity

    new_order = Order(
        customer_id=order.customer_id,
        product_id=order.product_id,
        quantity=order.quantity,
        total_amount=total_amount
    )

    db.add(new_order)

    db.commit()

    db.refresh(new_order)

    return new_order


@router.get("/orders")
def get_orders(
    db: Session = Depends(get_db)
):
    return db.query(Order).all()


@router.get("/orders/{id}")
def get_order(
    id: int,
    db: Session = Depends(get_db)
):
    order = db.get(Order, id)

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


@router.delete("/orders/{id}")
def delete_order(
    id: int,
    db: Session = Depends(get_db)
):
    order = db.get(Order, id)

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    db.delete(order)
    db.commit()

    return {"detail": "Order deleted"}