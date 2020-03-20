'''
By: Fitz
Created: 11 March 2020
Updated: 20 March 2020

Image Processing Script
Related scripts
- db.py - database setup, config, connect
- query.py - methods to query database
- models.py - class models for Tables in DB
'''

import pathlib
from PIL import Image as pillowImage
from db import session
from models import Images, Thumbnails
import sys


def process_image():
  '''
    takes user input, create thumbnail, and store in DB
  '''

  uploadsDirExists = pathlib.Path('./uploads').exists()
  thumbnailsDirExists = pathlib.Path('./thumbnails').exists()


  if not uploadsDirExists:
    pathlib.Path('./uploads').mkdir()
    print("Uploads folder did not exist but was created.")
    print("Add images to the Uploads folder and try again.")
    return
  if not thumbnailsDirExists:
    pathlib.Path('./thumbnails').mkdir()
    print("Thumbnails folder was created")

  pics = list(pathlib.Path('./uploads').glob('*.*'))

  size = (128, 128)
  userFileName = input("Input image name:  \n")
  imgToProcess = 'noFile'
  stem = 'noStem'
  suffix = 'noSuffix'

  for pic in pics:
    if userFileName == pic.name:
      imgToProcess = str(pic.name)
      stem = str(pic.stem)
      suffix = str(pic.suffix)
    elif userFileName == pic.stem and pic.suffix:
      imgToProcess = str(pic.name)
      stem = str(pic.stem)
      suffix = str(pic.suffix)



  pathToImg = str(pathlib.Path('./uploads/{0}'.format(imgToProcess)))

  thumbnailImg = '{0}.thumbnail{1}'.format(stem,suffix)
  pathToOutput = str(pathlib.Path('./thumbnails/{0}'.format(thumbnailImg)))



  try:
    inThumbnails = pathlib.Path(pathToOutput).exists()

    if inThumbnails:
      print('Thumbnail already exists')
      return

    img = pillowImage.open(pathToImg)
    img.thumbnail(size)
    img.save(pathToOutput, "JPEG")
    print('Created: {0} of size{1}'.format(thumbnailImg, str(size)))

  except FileNotFoundError:
    print('Oops there was an error.')
    print("File not found.")
    return

  except OSError:
    print('Oops there was an error.')
    print('Not an image file. Try again.')
    return

  except:
    print('Unexpected error:', sys.exc_info()[0])
    print('Check your configuration and try again.')
    return

  originalImage = Images(
    filename=imgToProcess,
    thumbnailImg=thumbnailImg,
    thumbnailPath=pathToOutput,
    isThumbnail=False)

  processedImage = Thumbnails(
    filename=thumbnailImg,
    original=imgToProcess,
    originalPath=pathToImg,
    isThumbnail=True)

  session.add_all([originalImage, processedImage])
  session.commit()


process_image()

