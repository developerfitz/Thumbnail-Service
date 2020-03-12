from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, Column, String, Integer

Base = declarative_base()

class SQLImage(Base):
  __tablename__ = 'Thumbnails'

  id = Column(Integer, primary_key=True)
  filename = Column(String)
  isThumbnail = Column(String)

  def __repr__(self):
    return "SQLImage<id={id}, filename='{filename}' isThumbnail='{isThumbnail}'>".format(
      id=self.id,
      filename=self.filename,
      isThumbnail=self.isThumbnail
    )


engine = create_engine('sqlite+pysqlite:///GG.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()
