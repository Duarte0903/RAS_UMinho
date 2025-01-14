from app.db import db
import uuid

class Project(db.Model):
    __tablename__ = "projects"  # Explicitly define table name to match the schema

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID primary key
    name = db.Column(db.String(200), nullable=False)  # Name of the project
    user_id = db.Column(db.String(36), nullable=False)  # Associated user ID (UUID)

    def save(self):
        """Save the instance to the database."""
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Delete the instance from the database."""
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        """Convert the instance into a dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id
        }
