'''
By: Fitz
Created: 11 March 2020
Updated: 12 March 2020
Total Time to Complete: 7-10
- 3-3.5 hours  on 11 March 2020
- 3-3.5 hours on 12 March 2020
- 2-3 hours wasted on trying to learn deeper unrelated tasks

Image Processing Script
Related scripts
- db.py - database setup, config, connect
- query.py - methods to query database


Find and select image processing library for python
- pillow or pgmagik

Resources
- https://opensource.com/article/19/3/python-image-manipulation-tools
- https://pillow.readthedocs.io/en/stable/handbook/index.html
- https://docs.python.org/3/library/os.html#os-file-dir
- https://docs.python.org/3/library/sys.html
- https://docs.sqlalchemy.org/en/13/orm/tutorial.html

'''

import os, sys
from PIL import Image
from db import session, SQLImage

def process_image():
  '''
    takes user input
  '''

  uploadsDirExists = os.path.isdir(os.getcwd() + '/uploads')
  thumbnailsDirExists = os.path.isdir(os.getcwd() + '/thumbnails')


  if not uploadsDirExists:
    os.mkdir(os.getcwd() + '/uploads')
    print("Uploads folder did not exist but was created.")
    print("Add images to Uploads folder and try again.")
    return
  if not thumbnailsDirExists:
    os.mkdir(os.getcwd() + '/thumbnails')
    print("Thumbnails folder was created")


  size = (128, 128)
  userFileName = input ("Input JPEG image name (no extention required): )? \n")
  imgToProcess = os.getcwd() + '/uploads/' + userFileName + '.jpg'
  outputFile = os.getcwd() + '/thumbnails/' + userFileName + '.thumbnail.jpg'


  if not os.path.exists(imgToProcess):
    print("Image not found")
    return

  if os.path.exists(outputFile):
    print("Thumbnail already Exits")
    return
  else:
    print("Preparing to process Image")


  img = Image.open(imgToProcess)
  img.thumbnail(size)
  img.save(outputFile, "JPEG")
  print('Image Processed, thumbnail' + str(size))


  originalImage = SQLImage(filename=imgToProcess, isThumbnail='False')
  thumbnailImage = SQLImage(filename=outputFile, isThumbnail='True')
  session.add_all([originalImage, thumbnailImage])
  session.commit()


process_image()

