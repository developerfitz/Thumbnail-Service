from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer

Base = declarative_base()


class Images(Base):
  __tablename__ = 'images'
  id = Column(Integer, primary_key=True)
  bucket = Column(String)
  filename = Column(String)

  # path in S3 bucket
  key = Column(String)
  thumbnail_key = Column(String)


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

