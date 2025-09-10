from .database import engine
from . import models, schemas

def reset_database():

    # Drop all tables
    models.Base.metadata.drop_all(bind=engine)
    # Recreate all tables
    models.Base.metadata.create_all(bind=engine)
    print("Database has been reset.")

if __name__ == "__main__":
    reset_database()