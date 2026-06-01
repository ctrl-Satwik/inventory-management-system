from sqlalchemy import Column, Integer, String, Float
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    sku = Column(String, unique=True)

    price = Column(Float)

    quantity = Column(Integer)