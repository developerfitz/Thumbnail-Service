from db import session, SQLImage

def filterThumbnails():
  query = session.query(SQLImage).filter_by(isThumbnail="True").all()

  for row in query:
    print(row)


def queryAll():
  query = session.query(SQLImage).all()
  for row in query:
    print(row)


filterThumbnails()
