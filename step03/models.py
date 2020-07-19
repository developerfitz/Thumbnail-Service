from app import db
from sqlalchemy import Column, String, Integer


class Image(db.Model):
    __tablename__ = 'images'

    id = Column(Integer, primary_key=True)
    filename = Column(String)

    def __repr__(self):
        return "Image<id={id}, filename='{filename}'>".format(
            id=self.id, 
            filename=self.filename
        )


class User(db.Model):
    __tablename__ = 'users'
    
    username = Column(String, primary_key=True)
    fullname = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    user_tier = Column(String)

    def __repr__(self):
        return "User<{username}>".format(
            id=self.username,
        )

    
    @classmethod
    def from_dict(cls, d):
        return cls(
            username=d['username'],
            fullname=d['fullname'],
            first_name=d['first_name'],
            last_name=d['last_name'],
            user_tier=d['user_tier']
        )


    def to_dict(self):
        return {
            'username': self.username,
            'fullname': self.fullname,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'user_tier': self.user_tier
        }