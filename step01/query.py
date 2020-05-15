from db import session
from models import Images, Thumbnails


def filter_by_name():
  input_name = input('Input exact filename: ')
  image_query = session.query(Images).filter_by(filename=input_name).one()

  if not image_query:
    print('Not found in DB.')
    print('Ensure filename is correct (including extension).')
  else:
    print(image_query)


filter_by_name()
