from pymongo import MongoClient

class Mongo:
    def __init__(self):
        self.client = None
        self.db = None

    def init_app(self, app):
        uri = app.config["MONGO_URI"]
        self.client = MongoClient(uri)
        # Extract DB name from URI or default to 'redora'
        db_name = uri.rsplit("/", 1)[-1].split("?")[0] or "redora"
        self.db = self.client[db_name]
        
        # Create indexes
        self.db.users.create_index("email", unique=True)
        self.db.documents.create_index("user_id")
        self.db.quizzes.create_index("user_id")
        self.db.performances.create_index("user_id")

mongo = Mongo()
