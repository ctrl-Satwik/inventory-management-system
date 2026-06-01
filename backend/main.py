from fastapi import FastAPI

from database import Base, engine

from routes.products import router as product_router
from routes.customer import router as customer_router
from routes.order import router as order_router
from routes import dashboard

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(product_router)
app.include_router(customer_router)
app.include_router(order_router)
app.include_router(dashboard.router)

