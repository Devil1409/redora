from pymongo import MongoClient

class Mongo:
    def __init__(self):
        self.client = None
        self.db = None

    def init_app(self, app):
        uri = app.config["MONGO_URI"]
        # Add timeout to prevent long hangs
        self.client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        db_name = uri.rsplit("/", 1)[-1].split("?")[0] or "redora"
        self.db = self.client[db_name]
        
        try:
            # Create indexes (non-blocking)
            self.db.users.create_index("email", unique=True)
            self.db.documents.create_index("user_id")
            self.db.quizzes.create_index("user_id")
            self.db.performances.create_index("user_id")
            print("✅ Database indexes verified.")
        except Exception as e:
            print(f"⚠️ Warning: Could not create database indexes: {e}")
            print("The app will continue, but DB performance may be affected until connection is stable.")

mongo = Mongo()
