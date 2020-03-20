from db import session
from models import Images, Thumbnails


def filterByName():
  inputName = input('Input exact filename: ')
  imageQuery = session.query(Images).filter_by(filename = inputName).all()
  thumbnailQuery = session.query(Thumbnails).filter_by(original = inputName).all()

  if not imageQuery and not thumbnailQuery:
    print('Not found in DB.')
    print('Ensure filename is correct (including extension).')
  else:
    print(imageQuery)
    print(thumbnailQuery)


filterByName()
