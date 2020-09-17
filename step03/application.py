import logging
import json
import os
import boto3
from botocore.exceptions import ClientError
import flask
from flask import request, Response
from io import BytesIO
from pathlib import PurePath
from urllib.parse import unquote_plus
from PIL import Image

REGION = 'us-east-1'
BUCKET_NAME = 'gg-photo-bucket'
OUTPUT_FOLDER = 'thumbnails'

# Create and configure the Flask application
application = flask.Flask(__name__)
application.logger.setLevel(logging.INFO)

session = boto3.Session(region_name=REGION)
s3 = session.client('s3')


class S3Message:
  def __init__(self, key):
    self.key = key

  @classmethod
  def parse(cls, message):
    '''
      This class method parses the request message from sqsd.
      unquote_plus used to replace "+" with spaces from files uploaded

      :returns: S3Message object
    '''
    # assumes only on record
    record = message['Records'].pop()
    key = unquote_plus(record['s3']['object']['key'])
    return cls(key)

def create_thumbnail(input_stream, size=(128, 128)):
  '''
    This function creates a thumbnail of an image.
    It expects bytes and returns bytes.

    :param input_stream:
    :param size:
    :returns: thumbnail output stream
  '''

  output_stream = BytesIO()
  image = Image.open(BytesIO(input_stream))
  image.thumbnail(size)
  image.save(output_stream, image.format)
  output_stream.seek(0)
  return output_stream

def create_thumbnail_key(key):
  '''
    This function creates the S3 key for the thumbnail to be uploaded to S3
    based on the key of the original image.

    :param key:
    :returns: thumbnail key (path) in specified S3 bucket
  '''

  key_path = PurePath(key)
  file_stem = key_path.stem
  file_ext = key_path.suffix
  return '{}/{}.thumbnail{}'.format(OUTPUT_FOLDER, file_stem, file_ext)


@application.route('/', methods=['POST'])
def process_message():
  if not request.json:
    return Response("No Message", status=415)

  # Prints SQS Message body
  application.logger.info(request.json)

  # incoming request message from sqsd
  message = S3Message.parse(request.json)

  try:
    get_object_response = s3.get_object(
      Bucket=BUCKET_NAME,
      Key=message.key
    )
  except ClientError as boto_error:
    '''boto3 errors (s3)'''
    application.logger.error(f'Botocore Error: {boto_error}')

  try:
    stream = get_object_response['Body'].read()
    thumbnail_stream = create_thumbnail(stream)
    thumbnail_key = create_thumbnail_key(message.key)
  except IOError as e:
    '''
      - errors from file not found or opened
      - errors if file not written

      Note: most errors from an image file or unsupported image file
    '''
    application.logger.error(f'IO Error: {e}')
    application.logger.error('Thumbnail not created.')
    raise e
  except OSError as e:
    '''system errors from BytesIO'''
    application.logger.error(f'OS Error: {e}')
    application.logger.error('Thumnail not created.')
    raise e
  except KeyError:
    '''error from no output format determined'''
    application.logger.error(f'Output error: {KeyError}')
    raise e
  
  try:
    s3.put_object(
      Bucket=BUCKET_NAME,
      Key=thumbnail_key,
      Body=thumbnail_stream
    )
  except ClientError as boto_error:
    application.logger.error(f'Botocore Error: {boto_error}')

  return Response('', status=200)

if __name__ == '__main__':
  application.run(host='0.0.0.0', port=80)
