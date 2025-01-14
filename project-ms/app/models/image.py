from app.db import db

class Image(db.Model):
    __tablename__ = "images"

    id = db.Column(db.String(36), primary_key=True)  # UUID as a string
    project_id = db.Column(db.String(36), db.ForeignKey("projects.id"), nullable=False)
    uri = db.Column(db.Text, nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "uri": self.uri
        }
