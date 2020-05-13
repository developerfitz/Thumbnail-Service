from db import session
from models import Images, Thumbnails


def filterByName():
  inputName = input('Input exact filename: ')
  imageQuery = session.query(Images).filter_by(filename=inputName).one()

  if not imageQuery:
    print('Not found in DB.')
    print('Ensure filename is correct (including extension).')
  else:
    print(imageQuery)


filterByName()
