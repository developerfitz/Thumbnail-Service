from flask import g
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import models

Base = models.Base

engine = create_engine('sqlite+pysqlite:///imagely.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
# session = Session()

# ? move the functions dealing with DB here and remove from utils.py
# ? use an access data layer class
