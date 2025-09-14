from sqlalchemy import text
from .database import engine
from . import models

def reset_database():
    """
    Reset the database by first removing all foreign key constraints,
    then dropping all tables, and finally recreating everything.
    """
    try:
        # Dispose any existing connections
        engine.dispose()
        
        with engine.connect() as connection:
            with connection.begin():
                # Step 1: Identify and drop all foreign key constraints
                fk_query = """
                SELECT
                    RC.RDB$RELATION_NAME as table_name,
                    RC.RDB$CONSTRAINT_NAME as constraint_name
                FROM RDB$RELATION_CONSTRAINTS RC
                WHERE RC.RDB$CONSTRAINT_TYPE = 'FOREIGN KEY'
                """
                
                foreign_keys = connection.execute(text(fk_query)).fetchall()
                
                for fk in foreign_keys:
                    table_name = fk[0].strip()
                    constraint_name = fk[1].strip()
                    try:
                        drop_fk_sql = f'ALTER TABLE "{table_name}" DROP CONSTRAINT "{constraint_name}"'
                        connection.execute(text(drop_fk_sql))
                        print(f"Dropped foreign key constraint {constraint_name} from {table_name}")
                    except Exception as e:
                        print(f"Error dropping constraint {constraint_name}: {e}")
                
                # Step 2: Drop all tables
                metadata = models.Base.metadata
                table_names = [table.name for table in metadata.sorted_tables]
                
                for table_name in reversed(table_names):
                    try:
                        drop_table_sql = f'DROP TABLE "{table_name}"'
                        connection.execute(text(drop_table_sql))
                        print(f"Dropped table {table_name}")
                    except Exception as e:
                        print(f"Error dropping table {table_name}: {e}")
                
                # Step 3: Recreate all tables with their constraints
                metadata.create_all(bind=connection)
                print("All tables have been recreated.")
                
        print("Database has been reset successfully.")
        return {"message": "Database has been reset successfully."}
    except Exception as e:
        error_msg = f"Error resetting database: {e}"
        print(error_msg)
        raise Exception(error_msg)

if __name__ == "__main__":
    reset_database()