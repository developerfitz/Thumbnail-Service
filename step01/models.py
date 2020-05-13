from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

Base = declarative_base()


class Images(Base):
  __tablename__ = 'images'
  id = Column(Integer, primary_key=True)
  bucket = Column(String)
  filename = Column(String)

  # path in S3 bucket
  key = Column(String)
  thumbnail_key = Column(String)

  thumbnail_id = Column(Integer, ForeignKey('thumbnails_table.id'))
  thumbnail = relationship('Thumbnails', uselist=False,
                           back_populates='original')

  def __repr__(self):
    return  '''Images
            <id={id},
            bucket='{bucket}', 
            filename='{filename}',
            key='{key}',
            thumbnail_key='{thumbnail_key}'>
            '''.format(
      id=self.id,
      bucket=self.bucket,
      filename=self.filename,
      key=self.key,
      thumbnail_key=self.thumbnail_key
    )


class Thumbnails(Base):
  __tablename__ = 'thumbnails_table'
  id = Column(Integer, primary_key=True)
  bucket = Column(String)
  filename = Column(String)

  # path in S3 bucket
  key = Column(String)
  original_key = Column(String)

  original = relationship('Images', back_populates='thumbnail')


  # respresentation of the Model that can be copied
  def __repr__(self):
    return  '''
            Thumbnails
            <id={id},
            bucket='{bucket}', 
            filename='{filename}', 
            key='{key}', 
            original_key='{original_key}'> 
            '''.format(
      id=self.id,
      bucket=self.bucket,
      filename=self.filename,
      key=self.key,
      original_key=self.original_key
    )

