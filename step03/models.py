from sqlalchemy import Column, String, Integer, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

# db models

class Profiles(Base):
  __tablename__ = 'user_profiles'
  user_id = Column(Integer, primary_key=True)
  github_id = Column(Integer)
  username = Column(String)
  email = Column(String)
  access_token = Column(String) # TODO: sensative data, delete 
  avatar_url = Column(String)
  is_registered = Column(Boolean)
  image_list = relationship('Images') 

  def __repr__(self):
    return f'''
            Profiles <user_id={self.user_id}, github_id={self.github_id},
            username={self.username}, email={self.email},
            avatar_url={self.avatar_url}, is_registered={self.is_registered}>
            '''


class Images(Base):
  __tablename__ = 'images'
  image_id = Column(Integer, primary_key=True)
  user_id = Column(Integer, ForeignKey('user_profiles.user_id'))
  bucket = Column(String) 
  key = Column(String) 
  thumbnail_key = Column(String)

  def __repr__(self):
    return f'''
            Images <user_id={self.user_id}, bucket={self.bucket},
            key={self.key}, thumbnail_key={self.thumbnail_key}>
            '''



# class UserGitHubProfile(Base):
#   __tablename__ = 'github_profiles'
#   id = ''
#   login = '' # username
#   avatar_url = ''
#   email = ''
#   access_token = ''
