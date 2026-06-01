from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models.product import Product
from schemas.product import ProductCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/products")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(Product).filter(
        Product.sku == product.sku
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    new_product = Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        quantity=product.quantity
    )

    db.add(new_product)

    db.commit()

    db.refresh(new_product)

    return new_product

@router.get("/products")
def get_products(
    db: Session = Depends(get_db)
):
    return db.query(Product).all()

@router.get("/products/{id}")
def get_product(
    id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).get(id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product

@router.put("/products/{id}")
def update_product(
    id: int,
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(Product).get(id)

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    existing.name = product.name
    existing.sku = product.sku
    existing.price = product.price
    existing.quantity = product.quantity

    db.commit()

    db.refresh(existing)

    return existing

@router.delete("/products/{id}")
def delete_product(
    id: int,
    db: Session = Depends(get_db)
):
    existing = db.query(Product).get(id)

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(existing)

    db.commit()

    return {"detail": "Product deleted"}