from app.db import db
import uuid
from sqlalchemy.dialects.postgresql import JSONB

class Tool(db.Model):
    __tablename__ = "tools"  # Explicitly define table name to match the schema

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID primary key
    position = db.Column(db.Integer, nullable=False)  # Position in the virtual tool list
    procedure = db.Column(db.String(200), nullable=False)  # Transformation type
    parameters = db.Column(JSONB, nullable=False)  # Store parameters as a JSONB object
    project_id = db.Column(db.String(36), db.ForeignKey("projects.id"), nullable=False)  # Associated project ID

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
            "position": self.position,
            "procedure": self.procedure,
            "parameters": self.parameters,
            "project_id": self.project_id
        }
