from app.db import db
import uuid
from sqlalchemy.orm import validates

class Process(db.Model):
    __tablename__ = "processes"  # Explicitly define table name to match the schema

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID primary key
    project_id = db.Column(db.String(36), db.ForeignKey("projects.id"), nullable=False)  # Associated project ID
    completed = db.Column(db.Integer, nullable=False, default=0)  # Number of images already processed
    total = db.Column(db.Integer, nullable=False)  # Number of images to be processed
    stop = db.Column(db.Boolean, nullable=False, default=False)  # If the process should be stopped
    

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
            "project_id": self.project_id,
            "completed": self.completed,
            "total": self.total,
            "stop": self.stop
        }
            
    @validates("completed")
    def validate_completed(self, key, value):
        if value < 0 or (self.total is not None and value > self.total):
            raise ValueError("Completed cannot exceed total or be negative")
        return value

    def increment_progress(self, count=1):
        if self.completed + count > self.total:
            raise ValueError("Cannot exceed total number of images")
        self.completed += count
        self.save()
