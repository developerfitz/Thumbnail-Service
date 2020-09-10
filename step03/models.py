from sqlalchemy import Column, String, Integer, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class Profiles(Base):
  __tablename__ = 'user_profiles'
  user_number = Column(Integer, primary_key=True)
  github_id = Column(Integer)
  username = Column(String)
  email = Column(String)
  # access_token = Column(String)
  avatar_url = Column(String)
  is_registered = Column(Boolean)

  image_list = relationship('Images') 

  def __repr__(self):
    return f'''
            Profiles <
              user_number={self.user_number}, 
              github_id={self.github_id},
              username={self.username}, 
              email={self.email},
              avatar_url={self.avatar_url}, 
              is_registered={self.is_registered}
            >
            '''

# Images class Not currently being used
# class Images(Base):
#   __tablename__ = 'images'
#   image_id = Column(Integer, primary_key=True)
#   user_number = Column(Integer, ForeignKey('user_profiles.user_number'))
#   bucket = Column(String) 
#   key = Column(String) 
#   thumbnail_key = Column(String)

#   def __repr__(self):
#     return f'''
#             Images <
#               user_number={self.user_number}, 
#               bucket={self.bucket},
#               key={self.key}, 
#               thumbnail_key={self.thumbnail_key}
#             >
#             '''
