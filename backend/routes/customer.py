from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models.customer import Customer
from schemas.customer import CustomerCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/customers")
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(Customer).filter(
        Customer.email == customer.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_customer = Customer(
        full_name=customer.full_name,
        email=customer.email,
        phone=customer.phone
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


@router.get("/customers")
def get_customers(
    db: Session = Depends(get_db)
):
    return db.query(Customer).all()


@router.get("/customers/{id}")
def get_customer(
    id: int,
    db: Session = Depends(get_db)
):
    customer = db.get(Customer, id)

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer


# @router.put("/customers/{id}")
# def update_customer(
#     id: int,
#     customer: CustomerCreate,
#     db: Session = Depends(get_db)
# ):
#     existing = db.get(Customer, id)

#     if not existing:
#         raise HTTPException(
#             status_code=404,
#             detail="Customer not found"
#         )

#     existing.full_name = customer.full_name
#     existing.email = customer.email
#     existing.phone = customer.phone

#     db.commit()
#     db.refresh(existing)

#     return existing


@router.delete("/customers/{id}")
def delete_customer(
    id: int,
    db: Session = Depends(get_db)
):
    existing = db.get(Customer, id)

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    db.delete(existing)
    db.commit()

    return {"detail": "Customer deleted"}