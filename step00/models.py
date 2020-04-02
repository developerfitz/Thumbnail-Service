from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer, Boolean

Base = declarative_base()

class Thumbnails(Base):
  __tablename__ = 'Thumbnails'

  id = Column(Integer, primary_key=True)
  filename = Column(String)
  original = Column(String)
  originalPath = Column(String)
  isThumbnail = Column(Boolean)

  def __repr__(self):
    return '''Thumbnails<id={id}, filename='{filename}', original='{original}', 
            originalPath='{originalPath}', isThumbnail={isThumbnail}>
            '''.format(
      id=self.id,
      filename=self.filename,
      original=self.original,
      originalPath=self.originalPath,
      isThumbnail=self.isThumbnail
    )


class Images(Base):
  __tablename__ = 'Images'

  id = Column(Integer, primary_key=True)
  filename = Column(String)
  thumbnailImg = Column(String)
  thumbnailPath = Column(String)
  isThumbnail = Column(Boolean)

  def __repr__(self):
    return '''Images<id={id}, filename='{filename}',
            thumbnailImg={thumbnailImg}, thumbnailPath={thumbnailPath}, 
            isThumbnail={isThumbnail}>
            '''.format(
      id=self.id,
      filename=self.filename,
      thumbnailImg=self.thumbnailImg,
      thumbnailPath=self.thumbnailPath,
      isThumbnail=self.isThumbnail
    )