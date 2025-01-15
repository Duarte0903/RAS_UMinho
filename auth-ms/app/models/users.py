from app.db import db
import uuid

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # Generate UUID by default
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(20), nullable=False, default="gratuito")  # Add `type` field with a default value

    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

    def to_dict(self, exclude_password=False):
        """Convert the User object to a dictionary. Optionally exclude the password hash."""
        user_dict = {
            "id": self.id,
            "email": self.email,
            "type": self.type  # Include the `type` field in the dictionary
        }
        if not exclude_password:
            user_dict["password_hash"] = self.password_hash
        return user_dict
