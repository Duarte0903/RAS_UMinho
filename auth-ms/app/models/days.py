from app.db import db
from datetime import date

class Day(db.Model):
    __tablename__ = "days"

    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), primary_key=True)  # User ID as part of the composite key
    operation_date = db.Column(db.Date, primary_key=True, default=date.today)  # Date as part of the composite key
    operations_count = db.Column(db.Integer, nullable=False, default=0)  # Number of operations performed

    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "operation_date": str(self.operation_date),
            "operations_count": self.operations_count,
        }
