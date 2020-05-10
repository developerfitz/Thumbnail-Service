from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship, backref

Base = declarative_base()

class Thumbnails(Base):
  __tablename__ = 'thumbnails'

  id = Column(Integer, primary_key=True)
  filename = Column(String)

  # path in S3 bucket
  key = Column(String)

  # foreign key for image
  image_id = Column(Integer, ForeignKey('images.id'))

  # one-to-one to images
  image = relationship('Images', back_populates='images')


  def __repr__(self):
    return  '''
            Thumbnails
            <id={id}, 
            filename='{filename}', 
            key='{key}', 
            image_id='{image_id}'>
            '''.format(
      id=self.id,
      filename=self.filename,
      key=self.key,
      image_id=self.image_id
    )


class Images(Base):
  __tablename__ = 'images'

  id = Column(Integer, primary_key=True)
  filename = Column(String)

  # path in S3 bucket
  key = Column(String)

  # one-to-one to thumbnails
  thumbnail = relationship('Thumbanils', back_populates='thumbnails')


  # foreign key for thumbnail
  thumbnail_id = Column(Integer, ForeignKey('thumbnails.id'))

  def __repr__(self):
    return  '''Images
            <id={id}, 
            filename='{filename}',
            key='{key}',
            thumbnail_id={thumbnail_id}>
            '''.format(
      id=self.id,
      filename=self.filename,
      key=self.key,
      thumbnail_id=self.thumbnail_id
    )


# TODO: commit model only
# refactor(DB): redesigned DB models