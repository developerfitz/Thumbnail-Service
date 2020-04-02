from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import models

Base = models.Base

engine = create_engine('sqlite+pysqlite:///GG.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()
