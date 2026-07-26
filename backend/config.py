import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://{user}:{password}@localhost:5432/cafe_fausse",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TOTAL_TABLES = 30
