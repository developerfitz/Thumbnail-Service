import boto3
from pathlib import PurePath
from io import BytesIO
from PIL import Image
from botocore.exceptions import ClientError
from sqlalchemy.exc import DBAPIError, SQLAlchemyError
from models import Images
import db
from SQSQueue import SQSQueue, SQSMessage

# Variables
BUCKET_NAME = 'gg-photo-bucket'
OUTPUT_FOLDER = 'thumbnails'
QUEUE_URL = 'https://queue.amazonaws.com/<AWS#>/thumbnail-uploads'

# Clients + Sessions
session = boto3.Session(profile_name='thumbnail-service')
s3 = session.client('s3')
sqs = session.client('sqs')


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


def create_image_record(bucket, key):
  '''
    Creates an Image object to store in DB.
    Record stored in Images table.

    :param bucket: S3 bucket to use
    :param key: path to image in specified S3 bucket
    :returns: Images Object
  '''
  return Images(bucket=bucket, filename=PurePath(key).name,
                key=key)


def main():
  # setting up SQSQueue to process SQSMessage
  sqs_message = SQSQueue(QUEUE_URL, session=session)
  print('Waiting for Messages...')
  while True:
    try:
      with sqs_message.get() as message:
        if message:
          try:
            get_object_response = s3.get_object(
              Bucket=BUCKET_NAME,
              Key=message.key
            )
          except ClientError as boto_error:
            '''boto3 errors (s3, sqs)'''
            print(f'Botocore Error: {boto_error}')

          try:
            print(f'Creating Thumbnail for {message._id}')
            stream = get_object_response['Body'].read()
            thumbnail_stream = create_thumbnail(stream)

            print(f'Uploading Thumbnail for {message._id}')
            thumbnail_key = create_thumbnail_key(message.key)
          except IOError as e:
            '''
              - errors from file not found or opened
              - errors if file not written
        
              Note: most errors from an image file or unsupported image file
            '''
            print(f'IO Error: {e}')
            print('Thumbnail not created.')
          except OSError as e:
            '''errors from BytesIO'''
            print(f'OS Error: {e}')
            print('Thumnail not created.')
          except KeyError:
            '''error from no output format'''
            print(f'Output error: {KeyError}')

          try:
            # creates and adds image record to DB
            image_for_database = create_image_record(BUCKET_NAME, message.key)
            db.session.add(image_for_database)

            # updates image record with thumbnail key
            image_for_database.thumbnail_key = thumbnail_key
            db.session.commit()

          except DBAPIError as db_error:
            '''error from DB API'''
            print(f'DB API Error: {db_error.statement}')
          except SQLAlchemyError as alchemy_error:
            '''error from ORM'''
            print(f'SQL Alchemy Error: {alchemy_error}')

          try:
            s3.put_object(
              Bucket=BUCKET_NAME,
              Key=thumbnail_key,
              Body=thumbnail_stream
            )
          except ClientError as boto_error:
            print(f'Botocore Error: {boto_error}')

    except Exception as e:
      '''errors not caught from above'''
      print(f'Uncaught Exception: {e}')
      raise e




if __name__ == '__main__':
  main()
